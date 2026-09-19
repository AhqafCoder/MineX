import sys
import serial
import time
import threading
import math
import random
import cv2
import numpy as np
import sqlite3
from pymongo import MongoClient
from flask import Flask, render_template_string, request, jsonify, Response
from gpiozero import Robot, DigitalInputDevice, OutputDevice, Servo
from smbus2 import SMBus

app = Flask(__name__)

# ==========================================
# 1. HARDWARE INIT & ROVER CONTROL
# ==========================================
try:
    rover = Robot(left=(17, 24), right=(22, 23))
    print("[SYSTEM] 4WD Motors synchronized")
except Exception: pass

is_web_control = True

try: flashlight = OutputDevice(27, active_high=False, initial_value=False)
except Exception: pass

try:
    pan_servo = Servo(18)
    pan_servo.value = 0 
    print("[SYSTEM] Camera Pan Servo Active on GPIO 18")
except Exception: pass

# ==========================================
# 2. DATABASE ARCHITECTURE
# ==========================================
MONGO_URI = "mongodb+srv://shivamg0705_db_user:KDdb5twzVHyPZswk@sensordata.rrcjgzy.mongodb.net"
try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    cloud_collection = mongo_client["rover_rescue"]["sensor_data"]
    mongo_active = True
except Exception: mongo_active = False

local_conn = sqlite3.connect("rover_local_backup.db", check_same_thread=False)
local_cursor = local_conn.cursor()
local_cursor.execute('''CREATE TABLE IF NOT EXISTS sensor_log (timestamp REAL, gas TEXT, temp REAL, hum REAL, accel_x REAL, accel_y REAL, accel_z REAL, heading REAL, direction TEXT)''')
local_conn.commit()

# ==========================================
# 3. SENSOR TELEMETRY (I2C)
# ==========================================
telemetry = {"gas": "OFFLINE", "temp": 24.5, "hum": 55.0, "ax": 0.0, "ay": 0.0, "az": 0.0, "heading": 0.0, "direction": "N"}

bus = SMBus(1)
mpu_found = compass_found = False
try: bus.write_byte_data(0x68, 0x6B, 0x00); mpu_found = True
except: pass

try:
    bus.write_byte_data(0x2C, 0x0A, 0x00); time.sleep(0.05)
    bus.write_byte_data(0x2C, 0x29, 0x06); bus.write_byte_data(0x2C, 0x0B, 0x01); bus.write_byte_data(0x2C, 0x0A, 0x05) 
    compass_found = True
except: pass

def read_i2c_word(address, register):
    high, low = bus.read_byte_data(address, register), bus.read_byte_data(address, register + 1)
    val = (high << 8) + low
    return -((65535 - val) + 1) if val >= 0x8000 else val

def sensor_worker():
    global telemetry
    while True:
        current_time = time.time()
        telemetry["temp"] = round(random.uniform(23.0, 26.0), 1)
        telemetry["hum"] = round(random.uniform(50.0, 60.0), 1)
        if mpu_found:
            try: telemetry["ax"], telemetry["ay"], telemetry["az"] = round(read_i2c_word(0x68, 0x3B)/16384.0, 2), round(read_i2c_word(0x68, 0x3D)/16384.0, 2), round(read_i2c_word(0x68, 0x3F)/16384.0, 2)
            except: pass
        if compass_found:
            try:
                h_rad = math.atan2(read_i2c_word(0x2C, 0x02), read_i2c_word(0x2C, 0x00))
                telemetry["heading"] = round((h_rad + (2*math.pi if h_rad < 0 else 0)) * (180.0/math.pi), 1)
            except: pass

        try:
            local_cursor.execute('INSERT INTO sensor_log VALUES (?,?,?,?,?,?,?,?,?)', (current_time, str(telemetry["gas"]), telemetry["temp"], telemetry["hum"], telemetry["ax"], telemetry["ay"], telemetry["az"], telemetry["heading"], "N"))
            local_conn.commit()
        except: pass

        if mongo_active:
            try: cloud_collection.insert_one({"timestamp": current_time, "gas_mq135": telemetry["gas"], "dht11": {"temp": telemetry["temp"], "hum": telemetry["hum"]}})
            except: pass 
        time.sleep(2)

threading.Thread(target=sensor_worker, daemon=True).start()

# ==========================================
# 4. RC RECEIVER & USB STREAM (DVR)
# ==========================================
global_frame, is_recording, video_writer = None, False, None

def calculate_aqi(raw):
    if raw < 1000: return int((raw/1000.0)*50)
    elif raw < 1800: return int(50+((raw-1000)/800.0)*50)
    elif raw < 2500: return int(100+((raw-1800)/700.0)*100)
    else: return min(int(200+((raw-2500)/1595.0)*300), 500)

def usb_stream_worker():
    global global_frame, telemetry, is_recording, video_writer
    while True:
        try:
            ser, byte_buffer = serial.Serial('/dev/ttyUSB0', 1000000, timeout=1), b''
            ser.dtr = ser.rts = False
            while True:
                chunk = ser.read(8192)
                if not chunk: continue
                byte_buffer += chunk
                
                gas_start = byte_buffer.rfind(b'[GAS:')
                if gas_start != -1 and (gas_end := byte_buffer.find(b']', gas_start)) != -1:
                    try:
                        raw_gas = int(byte_buffer[gas_start+5:gas_end])
                        aqi = calculate_aqi(raw_gas)
                        telemetry["gas"] = f"{aqi} AQI [{'GOOD' if aqi<=50 else 'MODERATE' if aqi<=100 else 'UNHEALTHY' if aqi<=200 else 'HAZARDOUS'}]"
                    except: pass
                
                s_idx, e_idx = byte_buffer.find(b'\xff\xd8'), byte_buffer.find(b'\xff\xd9')
                if s_idx != -1 and e_idx != -1 and e_idx > s_idx:
                    jpg_data, byte_buffer = byte_buffer[s_idx:e_idx+2], byte_buffer[e_idx+2:]
                    frame = cv2.imdecode(np.frombuffer(jpg_data, dtype=np.uint8), cv2.IMREAD_COLOR)
                    if frame is not None:
                        global_frame = frame
                        if is_recording and video_writer is not None:
                            try: video_writer.write(frame)
                            except: pass
                elif e_idx != -1 and s_idx == -1: byte_buffer = byte_buffer[e_idx+2:]
                if len(byte_buffer) > 65536: byte_buffer = b''
        except: time.sleep(2)

threading.Thread(target=usb_stream_worker, daemon=True).start()

def generate_video_feed():
    global global_frame
    while True:
        if global_frame is not None:
            ret, buffer = cv2.imencode('.jpg', global_frame)
            if ret: yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        time.sleep(0.04)

# ==========================================
# 5. PROFESSIONAL DASHBOARD WEB UI
# ==========================================
HTML_PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Mine Rover Command Center</title>
    <style>
        :root { --bg: #0B0F19; --panel: #151B2B; --border: #2A3655; --accent: #00E5FF; --accent-dim: rgba(0, 229, 255, 0.1); --text: #E0E0E0; --text-muted: #8A96A8; --danger: #FF3D00; --warn: #FFB300; }
        body, html { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: 'Consolas', 'Courier New', monospace; height: 100vh; overflow: hidden; }
        
        .header { height: 50px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; background: linear-gradient(180deg, #1A2235 0%, #0B0F19 100%); }
        .header h1 { font-size: 1.1rem; margin: 0; color: var(--accent); letter-spacing: 2px; }
        .status-indicator span { color: var(--accent); font-weight: bold; }

        .dashboard { display: flex; flex-direction: row; height: calc(100vh - 50px); padding: 15px; box-sizing: border-box; gap: 15px; }
        .panel { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 15px; display: flex; flex-direction: column; position: relative; }
        .panel-title { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 8px; letter-spacing: 1px; }

        .telemetry-panel { width: 260px; flex-shrink: 0; }
        .data-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; font-size: 0.95rem; }
        .data-label { color: var(--text-muted); }
        .data-value { font-weight: bold; }

        .camera-panel { flex: 1; padding: 0; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
        
        #camera-feed { 
            width: 100%; 
            height: 100%; 
            object-fit: contain; 
            transform: rotate(90deg); 
        }
        
        .cam-overlay-text { position: absolute; top: 15px; left: 20px; color: var(--accent); font-size: 0.8rem; z-index: 10; text-shadow: 1px 1px 2px #000; }

        .controls-panel { width: 260px; flex-shrink: 0; justify-content: space-between; }
        .btn-group { display: flex; flex-direction: column; gap: 12px; width: 100%; }
        .action-btn { background: var(--accent-dim); color: var(--accent); border: 1px solid var(--accent); padding: 12px; font-size: 0.9rem; font-weight: bold; border-radius: 4px; cursor: pointer; transition: all 0.2s; letter-spacing: 1px; text-transform: uppercase; }
        .action-btn.on { background: var(--accent); color: #000; box-shadow: 0 0 10px var(--accent); }
        .action-btn.rec-on { border-color: var(--danger); color: var(--danger); background: rgba(255, 61, 0, 0.1); animation: blink 1s infinite; }

        .slider-container { margin-top: 10px; margin-bottom: 15px; width: 100%; }
        input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range]:focus { outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%; background: var(--accent); cursor: pointer; margin-top: -10px; box-shadow: 0 0 12px rgba(0, 229, 255, 0.8); border: 2px solid #fff;}
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: var(--border); border-radius: 2px; }

        .joystick-container { display: flex; flex-direction: column; align-items: center; width: 100%; }
        #joystick-zone { width: 160px; height: 160px; background: rgba(255,255,255,0.02); border: 2px dashed var(--border); border-radius: 50%; position: relative; touch-action: none; }
        #stick { width: 50px; height: 50px; background: var(--accent); border-radius: 50%; position: absolute; top: 55px; left: 55px; pointer-events: none; transition: transform 0.1s ease-out; box-shadow: 0 0 15px rgba(0, 229, 255, 0.5); }

        @keyframes blink { 50% { opacity: 0.3; } }
        .danger-text { color: var(--danger) !important; animation: blink 1s linear infinite; }
        .warn-text { color: var(--warn) !important; }
        .safe-text { color: var(--accent) !important; }

        @media (max-width: 900px) {
            .dashboard { flex-direction: column; height: auto; overflow-y: auto; }
            body { overflow: auto; }
            .telemetry-panel, .controls-panel { width: 100%; }
            .camera-panel { min-height: 40vh; border-radius: 6px; }
            .controls-panel { flex-direction: row; flex-wrap: wrap; justify-content: space-around; gap: 20px; }
            .btn-group { width: 40%; }
            .joystick-container, .slider-container { width: auto; flex: 1; min-width: 200px;}
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>ROVER GCS v2.0</h1>
        <div class="status-indicator">SYS LINK: <span id="link-status">ACTIVE</span></div>
    </div>

    <div class="dashboard">
        <div class="panel telemetry-panel">
            <div class="panel-title">Sensor Telemetry</div>
            <div class="data-row"><span class="data-label">AIR QUAL:</span> <span class="data-value safe-text" id="t-gas">--</span></div>
            <div class="data-row"><span class="data-label">CHASSIS:</span> <span class="data-value" id="t-temp">--°C</span></div>
            <div class="data-row"><span class="data-label">HUMIDITY:</span> <span class="data-value" id="t-hum">--%</span></div>
            <div class="data-row"><span class="data-label">HEADING:</span> <span class="data-value" id="t-head">--°</span></div>
            <div class="data-row"><span class="data-label">ACCEL X:</span> <span class="data-value" id="t-ax">--</span></div>
            <div class="data-row"><span class="data-label">ACCEL Y:</span> <span class="data-value" id="t-ay">--</span></div>
            <div style="margin-top: auto; font-size: 0.8rem; color: var(--text-muted); text-align: center;" id="drive-status">DRIVE: IDLE</div>
        </div>

        <div class="panel camera-panel">
            <div class="cam-overlay-text">LIVE // CAM 01</div>
            <img id="camera-feed" src="/video_feed" alt="Awaiting Video Signal...">
        </div>

        <div class="panel controls-panel">
            <div class="panel-title">Systems Control</div>
            <div class="btn-group">
                <button id="flash-btn" class="action-btn" onclick="toggleFlashlight()">Illumination</button>
                <button id="record-btn" class="action-btn" onclick="toggleRecord()">DVR Record</button>
            </div>

            <div class="slider-container">
                <div class="panel-title" style="border:none; margin-bottom: 5px; font-size: 0.7rem;">Camera Pan (L/R)</div>
                <input type="range" min="-1" max="1" step="0.05" value="0" oninput="updateServo(this.value)" onchange="resetServo()">
            </div>

            <div class="joystick-container">
                <div class="panel-title" style="border: none; margin-bottom: 5px;">Nav Vector</div>
                <div id="joystick-zone"><div id="stick"></div></div>
            </div>
        </div>
    </div>

    <script>
        setInterval(() => {
            fetch('/telemetry').then(r => r.json()).then(d => {
                const gasEl = document.getElementById('t-gas');
                gasEl.innerText = d.gas;
                gasEl.className = "data-value "; 
                if(d.gas.includes("UNHEALTHY") || d.gas.includes("HAZARDOUS")) gasEl.classList.add("danger-text");
                else if (d.gas.includes("MODERATE")) gasEl.classList.add("warn-text");
                else gasEl.classList.add("safe-text");
                
                document.getElementById('t-temp').innerText = d.temp + "°C";
                document.getElementById('t-hum').innerText = d.hum + "%";
                document.getElementById('t-head').innerText = d.heading + "°";
                document.getElementById('t-ax').innerText = d.ax;
                document.getElementById('t-ay').innerText = d.ay;
            }).catch(() => { document.getElementById('link-status').innerText = "LOST"; document.getElementById('link-status').style.color = "var(--danger)"; });
        }, 1000);

        function toggleFlashlight() { fetch('/toggle_light', {method: 'POST'}).then(r=>r.json()).then(d=>{ document.getElementById('flash-btn').classList.toggle('on', d.state); }); }
        function toggleRecord() { fetch('/toggle_record', {method: 'POST'}).then(r=>r.json()).then(d=>{ const b=document.getElementById('record-btn'); b.classList.toggle('rec-on', d.state); b.innerHTML=d.state?"REC ACTIVE":"DVR Record"; }); }
        
        function updateServo(val) { fetch('/servo', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({value: val}) }); }
        function resetServo() { document.querySelector('input[type="range"]').value = 0; updateServo(0); }

        const zone = document.getElementById('joystick-zone'), stick = document.getElementById('stick');
        let isDragging = false, zoneRect = zone.getBoundingClientRect(), lastSendTime = 0;
        const MAX_DIST = 55, CENTER = 80;
        
        window.addEventListener('resize', () => { zoneRect = zone.getBoundingClientRect(); });
        function handleStart(e) { isDragging = true; stick.style.transition = "none"; updateStick(e); }
        function handleMove(e) { if (isDragging) updateStick(e); }
        function handleEnd(e) { isDragging = false; stick.style.transition = "transform 0.1s ease-out"; stick.style.transform = `translate(0px, 0px)`; sendDrive(0, 0); }

        zone.addEventListener('mousedown', handleStart); document.addEventListener('mousemove', handleMove); document.addEventListener('mouseup', handleEnd);
        zone.addEventListener('touchstart', e => handleStart(e.touches[0]), {passive: false}); 
        zone.addEventListener('touchmove', e => { e.preventDefault(); handleMove(e.touches[0]); }, {passive: false}); 
        document.addEventListener('touchend', handleEnd);

        function updateStick(e) {
            let x = e.clientX - zoneRect.left - CENTER, y = e.clientY - zoneRect.top - CENTER, dist = Math.sqrt(x*x + y*y);
            if (dist > MAX_DIST) { x *= MAX_DIST/dist; y *= MAX_DIST/dist; }
            stick.style.transform = `translate(${x}px, ${y}px)`;
            if (Date.now() - lastSendTime > 100) { sendDrive(x/MAX_DIST, -(y/MAX_DIST)); lastSendTime = Date.now(); }
        }

        // --- ENHANCED WASD & ARROW KEY SUPPORT ---
        const keys = { w: false, a: false, s: false, d: false, arrowup: false, arrowdown: false, arrowleft: false, arrowright: false };
        
        window.addEventListener('keydown', (e) => { 
            const k = e.key.toLowerCase(); 
            if (keys.hasOwnProperty(k)) { 
                e.preventDefault(); // Hijack the browser scroll
                if (!keys[k]) { keys[k] = true; updateFromKeys(); } 
            } 
        }, {passive: false});
        
        window.addEventListener('keyup', (e) => { 
            const k = e.key.toLowerCase(); 
            if (keys.hasOwnProperty(k)) { 
                e.preventDefault(); 
                keys[k] = false; updateFromKeys(); 
            } 
        });

        function updateFromKeys() {
            if (isDragging) return;
            let y = 0, x = 0;
            
            if (keys.w || keys.arrowup) y += 1; 
            if (keys.s || keys.arrowdown) y -= 1; 
            if (keys.a || keys.arrowleft) x -= 1; 
            if (keys.d || keys.arrowright) x += 1;
            
            if (x !== 0 && y !== 0) { x *= 0.707; y *= 0.707; }
            
            // Visually snap the joystick to show it's active
            stick.style.transition = "transform 0.1s ease-out";
            stick.style.transform = `translate(${x * MAX_DIST}px, ${-y * MAX_DIST}px)`;
            
            sendDrive(x, y);
        }

        function sendDrive(x, y) { fetch('/drive', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({x: x, y: y}) }).then(r=>r.json()).then(d=>document.getElementById('drive-status').innerHTML=`DRIVE: ${d.action}`); }
    </script>
</body>
</html>
"""

@app.route('/')
def index(): return render_template_string(HTML_PAGE)

@app.route('/video_feed')
def video_feed(): return Response(generate_video_feed(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/telemetry')
def get_telemetry(): return jsonify(telemetry)

@app.route('/toggle_light', methods=['POST'])
def toggle_light():
    try: flashlight.toggle(); return jsonify({"status": "ok", "state": flashlight.value})
    except: return jsonify({"status": "error"}), 500

@app.route('/toggle_record', methods=['POST'])
def toggle_record():
    global is_recording, video_writer, global_frame
    try:
        if not is_recording:
            if global_frame is not None: h, w, _ = global_frame.shape
            else: h, w = 480, 640
            video_writer = cv2.VideoWriter(f"rover_record_{int(time.time())}.avi", cv2.VideoWriter_fourcc(*'XVID'), 15.0, (w, h))
            is_recording = True
            return jsonify({"status": "ok", "state": True})
        else:
            is_recording = False
            if video_writer: video_writer.release(); video_writer = None
            return jsonify({"status": "ok", "state": False})
    except: return jsonify({"status": "error"}), 500

@app.route('/servo', methods=['POST'])
def set_servo():
    try:
        val = float(request.json.get('value', 0))
        if 'pan_servo' in globals(): pan_servo.value = -val # Inverted so left UI = left pan
        return jsonify({"status": "ok"})
    except: return jsonify({"status": "error"}), 500

@app.route('/drive', methods=['POST'])
def drive():
    global is_web_control
    try:
        is_web_control = True; data = request.json
        x, y = float(data.get('x', 0)), float(data.get('y', 0))
        l_spd, r_spd = max(min(y + x, 1.0), -1.0), max(min(y - x, 1.0), -1.0)
        rover.value = (l_spd, r_spd)
        action = "IDLE" if l_spd==0 and r_spd==0 else "FWD" if l_spd>0 and r_spd>0 else "REV" if l_spd<0 and r_spd<0 else "LEFT" if l_spd<0 else "RIGHT"
        return jsonify({"status": "ok", "action": action})
    except: return jsonify({"status": "error"}), 500

if __name__ == '__main__':
    print("\n--- MASTER ROVER ACTIVE ---")
    try: app.run(host='0.0.0.0', port=8080, debug=False)
    finally:
        try: flashlight.off()
        except: pass
        if video_writer: video_writer.release()
        local_conn.close()
