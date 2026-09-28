#!/usr/bin/env python3
"""
MineX AI Vision Service — Real-Time YOLOv8 Skeleton Pose & Rover Cam Integration
- Runs on local laptop with Apple Silicon MPS (Metal Performance Shaders) / CPU acceleration.
- Ingests video from:
    1. Rover ESP32-CAM stream (MJPEG over HTTP)
    2. Local laptop webcam (cv2.VideoCapture)
    3. Simulated underground tunnel test stream
- Detects 17 COCO skeletal keypoints per person and evaluates worker posture:
    - STANDING / UPRIGHT
    - CROUCHING / CRAWLING (low tunnel clearance)
    - FALLEN / DISTRESS (man-down emergency alert)
- Serves high-performance annotated MJPEG stream and JSON inference REST APIs for Next.js dashboard.
"""

import sys
import os
import time
import math
import argparse
import threading
from typing import Optional, List, Dict, Any

import cv2
import numpy as np
import torch
from ultralytics import YOLO
from fastapi import FastAPI, Response, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import uvicorn
import requests

# Resolve model path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POSSIBLE_MODEL_PATHS = [
    os.path.join(BASE_DIR, "yolov8n-pose.pt"),
    os.path.join(BASE_DIR, "..", "yolov8n-pose.pt"),
    "yolov8n-pose.pt"
]

MODEL_PATH = "yolov8n-pose.pt"
for p in POSSIBLE_MODEL_PATHS:
    if os.path.isfile(p):
        MODEL_PATH = p
        break

# Device selection: MPS (Apple Silicon GPU) > CUDA > CPU
if torch.backends.mps.is_available():
    DEVICE = "mps"
elif torch.cuda.is_available():
    DEVICE = "cuda"
else:
    DEVICE = "cpu"

print(f"[*] MineX AI Vision Service initializing...")
print(f"[*] Selected Compute Device: {DEVICE.upper()} (PyTorch {torch.__version__})")
print(f"[*] Loading YOLOv8 Pose model from: {MODEL_PATH}")

try:
    pose_model = YOLO(MODEL_PATH)
    print(f"[*] YOLOv8 Pose model successfully loaded!")
except Exception as e:
    print(f"[!] Error loading YOLO model: {e}")
    sys.exit(1)

# Global telemetry state
telemetry_lock = threading.Lock()
telemetry_data = {
    "status": "online",
    "device": DEVICE,
    "model": "YOLOv8n-Pose",
    "fps": 0.0,
    "latency_ms": 0.0,
    "persons_detected": 0,
    "postures": [],
    "active_source": "none",
    "alert_state": "normal",
    "last_updated": time.time(),
}

# Configurable options
runtime_config = {
    "conf_threshold": 0.35,
    "iou_threshold": 0.45,
    "show_skeleton": True,
    "show_boxes": True,
    "show_hud": True,
    "show_keypoint_labels": False,
    "fall_alert_enabled": True,
}

# Standard COCO 17 keypoint connections (SKELETON_EDGES)
SKELETON_EDGES = [
    # Head
    (0, 1), (0, 2), (1, 3), (2, 4),
    # Torso
    (5, 6), (5, 11), (6, 12), (11, 12),
    # Left Arm
    (5, 7), (7, 9),
    # Right Arm
    (6, 8), (8, 10),
    # Left Leg
    (11, 13), (13, 15),
    # Right Leg
    (12, 14), (14, 16)
]

KEYPOINT_NAMES = [
    "nose", "left_eye", "right_eye", "left_ear", "right_ear",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle"
]

# Color palettes (BGR for OpenCV)
COLOR_TORSO = (240, 180, 0)      # Cyan / Gold
COLOR_LEFT_ARM = (0, 140, 255)   # Orange
COLOR_RIGHT_ARM = (60, 220, 80)  # Neon Emerald
COLOR_LEFT_LEG = (220, 100, 20)  # Blue
COLOR_RIGHT_LEG = (40, 200, 160) # Mint
COLOR_HEAD = (180, 100, 255)     # Purple / Pink
COLOR_BOX_NORMAL = (0, 230, 100) # Bright Green
COLOR_BOX_FALLEN = (30, 40, 255) # Crimson Red Alert
COLOR_BOX_CROUCH = (0, 200, 255) # Gold Amber

def classify_posture(keypoints: np.ndarray, bbox: List[float]) -> Dict[str, Any]:
    """
    Evaluates worker posture using 17 COCO keypoints and bounding box geometry.
    keypoints: shape (17, 3) where [x, y, conf]
    bbox: [x1, y1, x2, y2]
    """
    x1, y1, x2, y2 = bbox
    box_w = max(1.0, x2 - x1)
    box_h = max(1.0, y2 - y1)
    aspect_ratio = box_w / box_h

    # Check keypoint confidences
    # 5: l_sh, 6: r_sh, 11: l_hip, 12: r_hip, 13: l_knee, 14: r_knee, 15: l_ank, 16: r_ank
    l_sh, r_sh = keypoints[5], keypoints[6]
    l_hip, r_hip = keypoints[11], keypoints[12]
    l_knee, r_knee = keypoints[13], keypoints[14]

    sh_valid = (l_sh[2] > 0.3) or (r_sh[2] > 0.3)
    hip_valid = (l_hip[2] > 0.3) or (r_hip[2] > 0.3)

    torso_angle_deg = 0.0
    is_fallen = False
    is_crouching = False

    if sh_valid and hip_valid:
        # Mid shoulder
        sh_x = (l_sh[0] + r_sh[0]) / 2.0 if (l_sh[2] > 0.3 and r_sh[2] > 0.3) else (l_sh[0] if l_sh[2] > 0.3 else r_sh[0])
        sh_y = (l_sh[1] + r_sh[1]) / 2.0 if (l_sh[2] > 0.3 and r_sh[2] > 0.3) else (l_sh[1] if l_sh[2] > 0.3 else r_sh[1])
        # Mid hip
        hip_x = (l_hip[0] + r_hip[0]) / 2.0 if (l_hip[2] > 0.3 and r_hip[2] > 0.3) else (l_hip[0] if l_hip[2] > 0.3 else r_hip[0])
        hip_y = (l_hip[1] + r_hip[1]) / 2.0 if (l_hip[2] > 0.3 and r_hip[2] > 0.3) else (l_hip[1] if l_hip[2] > 0.3 else r_hip[0])

        dx = abs(sh_x - hip_x)
        dy = abs(sh_y - hip_y)
        torso_angle_deg = math.degrees(math.atan2(dx, max(1.0, dy)))

        # Torso inclination > 50 degrees indicates lying down or collapsed
        if torso_angle_deg > 50.0:
            is_fallen = True
        elif dy < (box_h * 0.28): # Torso is heavily squished
            is_crouching = True
    elif aspect_ratio > 1.3:
        # Fallback to aspect ratio: width is significantly larger than height
        is_fallen = True

    # Check knee flexion for crouching
    if not is_fallen and (l_knee[2] > 0.3 or r_knee[2] > 0.3) and hip_valid:
        if aspect_ratio > 0.85 and box_h < (box_w * 1.3):
            is_crouching = True

    if is_fallen:
        return {"posture": "FALLEN", "label": "FALLEN / DISTRESS", "color": COLOR_BOX_FALLEN, "alert": True, "angle": round(torso_angle_deg, 1)}
    elif is_crouching:
        return {"posture": "CROUCHING", "label": "CROUCHING / CRAWLING", "color": COLOR_BOX_CROUCH, "alert": False, "angle": round(torso_angle_deg, 1)}
    else:
        return {"posture": "STANDING", "label": "STANDING / UPRIGHT", "color": COLOR_BOX_NORMAL, "alert": False, "angle": round(torso_angle_deg, 1)}

def draw_corner_rect(img, pt1, pt2, color, thickness=2, d=15):
    """Draws a modern high-tech bounding box with corner brackets."""
    x1, y1 = pt1
    x2, y2 = pt2
    # Base thin rectangle
    cv2.rectangle(img, (x1, y1), (x2, y2), color, 1, cv2.LINE_AA)
    
    # Corner brackets (thicker)
    c_thick = thickness + 1
    # Top-Left
    cv2.line(img, (x1, y1), (x1 + d, y1), color, c_thick, cv2.LINE_AA)
    cv2.line(img, (x1, y1), (x1, y1 + d), color, c_thick, cv2.LINE_AA)
    # Top-Right
    cv2.line(img, (x2, y1), (x2 - d, y1), color, c_thick, cv2.LINE_AA)
    cv2.line(img, (x2, y1), (x2, y1 + d), color, c_thick, cv2.LINE_AA)
    # Bottom-Left
    cv2.line(img, (x1, y2), (x1 + d, y2), color, c_thick, cv2.LINE_AA)
    cv2.line(img, (x1, y2), (x1, y2 - d), color, c_thick, cv2.LINE_AA)
    # Bottom-Right
    cv2.line(img, (x2, y2), (x2 - d, y2), color, c_thick, cv2.LINE_AA)
    cv2.line(img, (x2, y2), (x2, y2 - d), color, c_thick, cv2.LINE_AA)

def render_pose_annotations(frame: np.ndarray, results, latency_ms: float, fps: float) -> tuple[np.ndarray, List[Dict[str, Any]]]:
    """Renders sleek, high-tech skeletal overlays, boxes, and HUD on frame."""
    h, w = frame.shape[:2]
    annotated = frame.copy()
    detections = []
    has_critical_alert = False

    if results and len(results) > 0:
        r = results[0]
        boxes = r.boxes
        keypoints_obj = r.keypoints

        if boxes is not None and keypoints_obj is not None and len(boxes) > 0:
            kpts_data = keypoints_obj.data.cpu().numpy() # shape (N, 17, 3) or (N, 17, 2)
            xyxy_boxes = boxes.xyxy.cpu().numpy()
            confidences = boxes.conf.cpu().numpy()

            for i in range(len(xyxy_boxes)):
                bbox = [float(x) for x in xyxy_boxes[i]]
                conf = float(confidences[i])
                kpts = kpts_data[i] # (17, 3)

                # Ensure 3 columns: x, y, conf
                if kpts.shape[-1] == 2:
                    kpts = np.hstack([kpts, np.ones((17, 1), dtype=np.float32)])

                posture_info = classify_posture(kpts, bbox)
                if posture_info["alert"]:
                    has_critical_alert = True

                detections.append({
                    "id": i + 1,
                    "box": [round(b, 1) for b in bbox],
                    "confidence": round(conf, 3),
                    "posture": posture_info["posture"],
                    "posture_label": posture_info["label"],
                    "alert": posture_info["alert"],
                    "torso_angle": posture_info.get("angle", 0.0),
                    "keypoints": [
                        {"name": KEYPOINT_NAMES[k_idx], "x": round(float(kpts[k_idx][0]), 1), "y": round(float(kpts[k_idx][1]), 1), "conf": round(float(kpts[k_idx][2]), 2)}
                        for k_idx in range(17)
                    ]
                })

                box_color = posture_info["color"]
                x1, y1, x2, y2 = [int(v) for v in bbox]

                # Draw Bounding Box if enabled
                if runtime_config["show_boxes"]:
                    draw_corner_rect(annotated, (x1, y1), (x2, y2), box_color, thickness=2, d=min(20, int(box_h := (y2 - y1)) // 4))

                    # Posture & ID Badge
                    badge_text = f"#{i+1} MINER | {posture_info['posture']} ({int(conf * 100)}%)"
                    (tw, th), _ = cv2.getTextSize(badge_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                    badge_y = max(18, y1 - 6)
                    cv2.rectangle(annotated, (x1, badge_y - th - 5), (x1 + tw + 10, badge_y + 3), (20, 20, 25), -1)
                    cv2.rectangle(annotated, (x1, badge_y - th - 5), (x1 + tw + 10, badge_y + 3), box_color, 1)
                    cv2.putText(annotated, badge_text, (x1 + 5, badge_y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.45, box_color, 1, cv2.LINE_AA)

                # Draw Skeleton Links if enabled
                if runtime_config["show_skeleton"]:
                    for p1_idx, p2_idx in SKELETON_EDGES:
                        p1 = kpts[p1_idx]
                        p2 = kpts[p2_idx]
                        if p1[2] > runtime_config["conf_threshold"] and p2[2] > runtime_config["conf_threshold"]:
                            pt1 = (int(p1[0]), int(p1[1]))
                            pt2 = (int(p2[0]), int(p2[1]))

                            # Pick limb color
                            if p1_idx in [0, 1, 2, 3, 4] or p2_idx in [0, 1, 2, 3, 4]:
                                edge_color = COLOR_HEAD
                            elif p1_idx in [5, 6, 11, 12] and p2_idx in [5, 6, 11, 12]:
                                edge_color = COLOR_TORSO
                            elif p1_idx in [5, 7, 9] or p2_idx in [5, 7, 9]:
                                edge_color = COLOR_LEFT_ARM
                            elif p1_idx in [6, 8, 10] or p2_idx in [6, 8, 10]:
                                edge_color = COLOR_RIGHT_ARM
                            elif p1_idx in [11, 13, 15] or p2_idx in [11, 13, 15]:
                                edge_color = COLOR_LEFT_LEG
                            else:
                                edge_color = COLOR_RIGHT_LEG

                            if posture_info["alert"]:
                                edge_color = COLOR_BOX_FALLEN

                            # Glowing anti-aliased line
                            cv2.line(annotated, pt1, pt2, edge_color, 2, cv2.LINE_AA)

                    # Draw Keypoint Joints
                    for k_idx in range(17):
                        kp = kpts[k_idx]
                        if kp[2] > runtime_config["conf_threshold"]:
                            k_pos = (int(kp[0]), int(kp[1]))
                            # Outer halo & inner dot
                            cv2.circle(annotated, k_pos, 4, (20, 20, 25), -1, cv2.LINE_AA)
                            cv2.circle(annotated, k_pos, 3, box_color if posture_info["alert"] else (0, 255, 255), -1, cv2.LINE_AA)

    # Draw Top HUD Bar if enabled
    if runtime_config["show_hud"]:
        # Top banner with glassmorphism style
        banner_h = 32
        overlay = annotated.copy()
        cv2.rectangle(overlay, (0, 0), (w, banner_h), (15, 17, 23), -1)
        cv2.addWeighted(overlay, 0.85, annotated, 0.15, 0, annotated)
        cv2.line(annotated, (0, banner_h), (w, banner_h), (50, 55, 70), 1)

        # Left: Model badge & Device
        hud_left = f"YOLOv8-POSE · {DEVICE.upper()} ACCEL · {latency_ms:.1f}ms ({fps:.0f} FPS)"
        cv2.putText(annotated, hud_left, (10, 21), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (220, 220, 220), 1, cv2.LINE_AA)

        # Right: Detections & Hazard Status
        p_count = len(detections)
        if has_critical_alert:
            alert_text = f"⚠️ MAN DOWN ALERT! ({p_count} PERSONNEL)"
            cv2.putText(annotated, alert_text, (max(10, w - 310), 21), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 80, 255), 2, cv2.LINE_AA)
        else:
            status_text = f"PERSONNEL DETECTED: {p_count}" if p_count > 0 else "SCANNING FOR PERSONNEL..."
            status_color = (100, 255, 150) if p_count > 0 else (160, 160, 160)
            (stw, _), _ = cv2.getTextSize(status_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
            cv2.putText(annotated, status_text, (max(10, w - stw - 15), 21), cv2.FONT_HERSHEY_SIMPLEX, 0.45, status_color, 1, cv2.LINE_AA)

    return annotated, detections

def generate_simulated_frame(step: int) -> np.ndarray:
    """Generates an animated underground tunnel scene with walking/working miners."""
    w, h = 640, 480
    frame = np.zeros((h, w, 3), dtype=np.uint8)

    # Tunnel walls gradient (dark rock)
    for y in range(h):
        shade = int(25 + 15 * math.sin(y / 40.0) + (y / h) * 20)
        frame[y, :] = (int(shade * 0.8), int(shade * 0.9), shade)

    # Tunnel arch perspective lines
    cv2.line(frame, (0, 0), (w // 2, h // 2), (55, 60, 70), 1, cv2.LINE_AA)
    cv2.line(frame, (w, 0), (w // 2, h // 2), (55, 60, 70), 1, cv2.LINE_AA)
    cv2.line(frame, (0, h), (w // 2, h // 2), (70, 75, 85), 1, cv2.LINE_AA)
    cv2.line(frame, (w, h), (w // 2, h // 2), (70, 75, 85), 1, cv2.LINE_AA)

    # Tunnel ribs (timber/steel supports)
    for offset in [0.2, 0.4, 0.6, 0.8]:
        y_pos = int(h * offset)
        cv2.ellipse(frame, (w // 2, y_pos), (int(w * offset * 0.48), int(h * offset * 0.35)), 0, 180, 360, (50, 55, 65), 2, cv2.LINE_AA)

    # Animated synthetic miner figure
    cycle = (step % 200) / 200.0
    miner_x = int(180 + 260 * math.sin(cycle * math.pi * 2))
    miner_y = 280
    miner_scale = 1.0 + 0.15 * math.cos(cycle * math.pi)

    # Draw realistic humanoid silhouette that YOLOv8-pose can recognize
    # Head with miner helmet
    head_r = int(18 * miner_scale)
    cv2.circle(frame, (miner_x, miner_y - int(75 * miner_scale)), head_r, (180, 150, 120), -1)
    # Yellow hardhat with headlamp
    cv2.ellipse(frame, (miner_x, miner_y - int(82 * miner_scale)), (int(head_r * 1.2), int(head_r * 0.6)), 0, 180, 360, (0, 220, 255), -1)
    cv2.circle(frame, (miner_x, miner_y - int(80 * miner_scale)), 4, (0, 255, 255), -1) # Headlamp beam spot

    # Torso (safety orange vest)
    torso_top = (miner_x, miner_y - int(60 * miner_scale))
    torso_w = int(22 * miner_scale)
    torso_h = int(48 * miner_scale)
    cv2.rectangle(frame, (miner_x - torso_w, miner_y - int(60 * miner_scale)), (miner_x + torso_w, miner_y - int(12 * miner_scale)), (0, 120, 255), -1)
    # Reflective silver stripes
    cv2.rectangle(frame, (miner_x - torso_w, miner_y - int(45 * miner_scale)), (miner_x + torso_w, miner_y - int(40 * miner_scale)), (220, 220, 220), -1)

    # Legs (walking motion)
    leg_swing = math.sin(cycle * math.pi * 8) * 14 * miner_scale
    cv2.line(frame, (miner_x - int(10 * miner_scale), miner_y - int(12 * miner_scale)), (miner_x - int(12 * miner_scale) + int(leg_swing), miner_y + int(50 * miner_scale)), (80, 70, 60), int(10 * miner_scale))
    cv2.line(frame, (miner_x + int(10 * miner_scale), miner_y - int(12 * miner_scale)), (miner_x + int(12 * miner_scale) - int(leg_swing), miner_y + int(50 * miner_scale)), (80, 70, 60), int(10 * miner_scale))

    # Arms
    arm_swing = math.cos(cycle * math.pi * 8) * 12 * miner_scale
    cv2.line(frame, (miner_x - torso_w, miner_y - int(55 * miner_scale)), (miner_x - torso_w - 6 - int(arm_swing), miner_y - int(20 * miner_scale)), (0, 100, 220), int(7 * miner_scale))
    cv2.line(frame, (miner_x + torso_w, miner_y - int(55 * miner_scale)), (miner_x + torso_w + 6 + int(arm_swing), miner_y - int(20 * miner_scale)), (0, 100, 220), int(7 * miner_scale))

    # Watermark
    cv2.putText(frame, "MINEX TUNNEL SIMULATOR [SYNTHETIC FEED]", (15, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (120, 130, 140), 1, cv2.LINE_AA)
    return frame

# Fast MJPEG Video Stream Generator
class VideoSourceStreamer:
    def __init__(self):
        self.cap = None
        self.current_source = ""
        self.lock = threading.Lock()

    def get_frame(self, source_type: str, rover_ip: str, sim_step: int) -> Optional[np.ndarray]:
        """Fetches raw frame from selected source."""
        if source_type == "webcam":
            with self.lock:
                if self.cap is None or self.current_source != "webcam":
                    if self.cap:
                        self.cap.release()
                    self.cap = cv2.VideoCapture(0)
                    self.current_source = "webcam"
                if self.cap and self.cap.isOpened():
                    ret, frame = self.cap.read()
                    if ret:
                        return frame
            # Fallback to simulation if webcam not accessible
            return generate_simulated_frame(sim_step)

        elif source_type == "rover":
            # Attempt to pull snapshot or stream from rover
            if not rover_ip:
                rover_ip = "http://winner.local:8080"
            clean_ip = rover_ip.rstrip("/")
            if not clean_ip.startswith("http://") and not clean_ip.startswith("https://"):
                clean_ip = f"http://{clean_ip}"

            # Try snapshot endpoint first (lowest latency, zero socket lockup)
            for path in ["/capture", "/snapshot", "/cam-hi.jpg"]:
                try:
                    resp = requests.get(f"{clean_ip}{path}", timeout=0.8)
                    if resp.status_code == 200:
                        img_arr = np.frombuffer(resp.content, dtype=np.uint8)
                        frame = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
                        if frame is not None:
                            return frame
                except Exception:
                    pass

            # Try OpenCV stream read from MJPEG feed
            with self.lock:
                stream_url = f"{clean_ip}/video_feed"
                if self.cap is None or self.current_source != stream_url:
                    if self.cap:
                        self.cap.release()
                    self.cap = cv2.VideoCapture(stream_url)
                    self.current_source = stream_url

                if self.cap and self.cap.isOpened():
                    ret, frame = self.cap.read()
                    if ret and frame is not None:
                        return frame

            # If rover offline, return simulated frame with notice
            sim = generate_simulated_frame(sim_step)
            cv2.rectangle(sim, (10, 40), (450, 75), (0, 0, 160), -1)
            cv2.putText(sim, f"ROVER CAM NOT CONNECTED: {clean_ip}", (20, 62), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
            return sim

        else: # default: "sim"
            return generate_simulated_frame(sim_step)

video_streamer = VideoSourceStreamer()

# FastAPI application
app = FastAPI(title="MineX YOLOv8 Pose Vision AI Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {
        "service": "MineX YOLOv8 Pose Vision AI",
        "status": "online",
        "device": DEVICE,
        "model": "yolov8n-pose.pt",
        "docs": "/docs",
        "endpoints": {
            "status": "/status",
            "annotated_feed": "/annotated_feed",
            "detect_pose": "/detect_pose",
            "config": "/config",
        }
    }

@app.get("/status")
def get_status():
    with telemetry_lock:
        data = dict(telemetry_data)
        data["config"] = runtime_config
        return data

@app.get("/config")
def get_config():
    return runtime_config

@app.post("/config")
def update_config(update: Dict[str, Any]):
    for k, v in update.items():
        if k in runtime_config:
            runtime_config[k] = v
    return {"status": "ok", "config": runtime_config}

@app.get("/annotated_feed")
def annotated_feed(
    source: str = Query("rover", description="rover | webcam | sim"),
    rover_ip: str = Query("http://winner.local:8080", description="Rover base IP or URL"),
    conf: Optional[float] = Query(None, description="Confidence threshold"),
    rotation: int = Query(0, description="Rotation in degrees (0, 90, 180, 270)")
):
    """
    MJPEG stream yielding frames with real-time YOLOv8 skeleton pose annotations.
    """
    conf_thresh = conf if conf is not None else runtime_config["conf_threshold"]

    def frame_generator():
        step = 0
        fps_tracker = []

        while True:
            t_start = time.time()
            step += 1

            # 1. Grab frame from requested source
            frame = video_streamer.get_frame(source, rover_ip, step)
            if frame is None:
                time.sleep(0.03)
                continue

            # Apply rotation if requested (for rotated ESP32-CAMs)
            if rotation == 90:
                frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
            elif rotation == 180:
                frame = cv2.rotate(frame, cv2.ROTATE_180)
            elif rotation == 270:
                frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)

            # 2. Run YOLOv8 pose inference
            t_infer_start = time.time()
            try:
                results = pose_model(frame, conf=conf_thresh, verbose=False, device=DEVICE)
                infer_latency_ms = (time.time() - t_infer_start) * 1000.0
            except Exception as e:
                infer_latency_ms = 0.0
                results = None

            # 3. Calculate FPS
            t_total = time.time() - t_start
            fps = 1.0 / max(0.001, t_total)
            fps_tracker.append(fps)
            if len(fps_tracker) > 15:
                fps_tracker.pop(0)
            avg_fps = sum(fps_tracker) / len(fps_tracker)

            # 4. Render sleek skeletal overlays & HUD
            annotated_frame, detections = render_pose_annotations(frame, results, infer_latency_ms, avg_fps)

            # 5. Update global telemetry
            with telemetry_lock:
                telemetry_data["fps"] = round(avg_fps, 1)
                telemetry_data["latency_ms"] = round(infer_latency_ms, 1)
                telemetry_data["persons_detected"] = len(detections)
                telemetry_data["postures"] = [d["posture"] for d in detections]
                telemetry_data["alert_state"] = "hazard" if any(d["alert"] for d in detections) else "normal"
                telemetry_data["active_source"] = source
                telemetry_data["last_updated"] = time.time()

            # 6. Encode to JPEG
            ret, jpeg = cv2.imencode(".jpg", annotated_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 82])
            if not ret:
                continue

            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n")

            # Maintain frame pace
            time.sleep(0.015)

    return StreamingResponse(
        frame_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }
    )

@app.post("/detect_pose")
async def detect_pose(request: Request):
    """
    Accepts raw image bytes or base64 frame, runs YOLOv8 pose and returns JSON detections.
    """
    t_start = time.time()
    body = await request.body()
    if not body:
        return JSONResponse({"error": "Empty body"}, status_code=400)

    try:
        img_arr = np.frombuffer(body, dtype=np.uint8)
        frame = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
        if frame is None:
            return JSONResponse({"error": "Invalid image data"}, status_code=400)

        t_infer = time.time()
        results = pose_model(frame, conf=runtime_config["conf_threshold"], verbose=False, device=DEVICE)
        infer_ms = (time.time() - t_infer) * 1000.0

        _, detections = render_pose_annotations(frame, results, infer_ms, 0.0)

        return {
            "status": "ok",
            "device": DEVICE,
            "latency_ms": round(infer_ms, 1),
            "persons_detected": len(detections),
            "detections": detections,
            "total_ms": round((time.time() - t_start) * 1000.0, 1),
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

def main():
    parser = argparse.ArgumentParser(description="MineX YOLOv8 Pose AI Vision Server")
    parser.add_argument("--port", type=int, default=8001, help="Port to bind server (default: 8001)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host interface to bind")
    parser.add_argument("--test", action="store_true", help="Run quick benchmark test and exit")
    args = parser.parse_args()

    if args.test:
        print("[*] Running YOLOv8 Pose benchmark...")
        dummy = generate_simulated_frame(0)
        # Warmup
        _ = pose_model(dummy, verbose=False, device=DEVICE)
        times = []
        for _ in range(10):
            t0 = time.time()
            _ = pose_model(dummy, verbose=False, device=DEVICE)
            times.append((time.time() - t0) * 1000.0)
        avg_ms = sum(times) / len(times)
        print(f"[✓] Benchmark complete: Average latency = {avg_ms:.2f}ms (~{1000/avg_ms:.0f} FPS) on {DEVICE.upper()}")
        sys.exit(0)

    print(f"[*] Starting MineX Vision AI server on http://{args.host}:{args.port}")
    uvicorn.run(app, host=args.host, port=args.port, log_level="warning")

if __name__ == "__main__":
    main()
