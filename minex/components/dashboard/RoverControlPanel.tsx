"use client";

import {
  Gamepad2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Keyboard,
  Power,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";
import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  state: DashboardState;
  onModeChange: (mode: "manual" | "assisted" | "autonomous") => void;
}

export default function RoverControlPanel({ state }: Props) {
  const [lightOn, setLightOn] = useState(false);
  const [wasdEnabled, setWasdEnabled] = useState(true);
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  
  const disabled = state.isLive && state.connection !== "connected";

  // Use refs for drive loop to avoid stale closures
  const activeKeysRef = useRef<Set<string>>(new Set());
  const lastVectorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const repeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sendDrive = useCallback(
    (x: number, y: number) => {
      if (!state.isLive) return;
      lastVectorRef.current = { x, y };

      fetch(`/api/rover/drive?ip=${encodeURIComponent(state.roverIp)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          speed: 80,
        }),
      }).catch(() => {});
    },
    [state.isLive, state.roverIp]
  );

  // Compute drive vector from currently held keys
  const updateDriveFromKeys = useCallback(() => {
    const keys = activeKeysRef.current;
    
    // Check for brake (Space)
    if (keys.has(" ") || keys.has("space")) {
      sendDrive(0, 0);
      return;
    }

    let y = 0;
    if (keys.has("w") || keys.has("arrowup")) y += 1;
    if (keys.has("s") || keys.has("arrowdown")) y -= 1;

    let x = 0;
    if (keys.has("d") || keys.has("arrowright")) x += 1;
    if (keys.has("a") || keys.has("arrowleft")) x -= 1;

    // Normalize diagonal speed
    if (x !== 0 && y !== 0) {
      x *= 0.707;
      y *= 0.707;
    }

    sendDrive(x, y);
  }, [sendDrive]);

  // Global WASD / Arrow keyboard listener
  useEffect(() => {
    if (!wasdEnabled || disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const validKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " "];

      if (validKeys.includes(key)) {
        // Prevent page scrolling on arrows and space
        if (key.startsWith("arrow") || key === " ") {
          e.preventDefault();
        }

        if (!activeKeysRef.current.has(key)) {
          activeKeysRef.current.add(key);
          setPressedKeys((prev) => ({ ...prev, [key]: true }));
          updateDriveFromKeys();

          // Start repeat pulse to keep rover moving while key is held down
          if (!repeatTimerRef.current) {
            repeatTimerRef.current = setInterval(() => {
              if (activeKeysRef.current.size > 0) {
                updateDriveFromKeys();
              }
            }, 120);
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (activeKeysRef.current.has(key)) {
        activeKeysRef.current.delete(key);
        setPressedKeys((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });

        if (activeKeysRef.current.size === 0) {
          if (repeatTimerRef.current) {
            clearInterval(repeatTimerRef.current);
            repeatTimerRef.current = null;
          }
          sendDrive(0, 0);
        } else {
          updateDriveFromKeys();
        }
      }
    };

    // Safety: if window loses focus, immediately stop rover
    const handleBlur = () => {
      activeKeysRef.current.clear();
      setPressedKeys({});
      if (repeatTimerRef.current) {
        clearInterval(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
      sendDrive(0, 0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      if (repeatTimerRef.current) {
        clearInterval(repeatTimerRef.current);
        repeatTimerRef.current = null;
      }
    };
  }, [wasdEnabled, disabled, updateDriveFromKeys, sendDrive]);

  const toggleLight = async () => {
    if (!state.isLive) {
      setLightOn(!lightOn);
      return;
    }
    try {
      const res = await fetch(`/api/rover/light?ip=${encodeURIComponent(state.roverIp)}`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLightOn(data.state);
      }
    } catch (e) {}
  };

  const setPan = (val: number) => {
    if (!state.isLive) return;
    fetch(`/api/rover/servo?ip=${encodeURIComponent(state.roverIp)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: val }),
    }).catch(() => {});
  };

  const isWPressed = pressedKeys["w"] || pressedKeys["arrowup"];
  const isAPressed = pressedKeys["a"] || pressedKeys["arrowleft"];
  const isSPressed = pressedKeys["s"] || pressedKeys["arrowdown"];
  const isDPressed = pressedKeys["d"] || pressedKeys["arrowright"];
  const isBrakePressed = pressedKeys[" "];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Rover Navigation Control</h3>
              {wasdEnabled && (
                <span className="flex items-center gap-1 text-[9px] bg-orange-50 text-orange-700 font-bold px-1.5 py-0.5 rounded border border-orange-200">
                  <Keyboard className="w-2.5 h-2.5" />
                  WASD ACTIVE
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500">4WD Differential Drive · Keyboard & D-Pad</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* WASD Toggle */}
          <button
            onClick={() => setWasdEnabled(!wasdEnabled)}
            className={cn(
              "px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 border",
              wasdEnabled
                ? "bg-orange-50 text-orange-700 border-orange-200 shadow-xs"
                : "bg-gray-50 text-gray-400 border-gray-200 hover:text-gray-700"
            )}
            title={wasdEnabled ? "WASD Keyboard controls enabled" : "Enable WASD keyboard controls"}
          >
            <Keyboard className="w-3 h-3" />
            WASD {wasdEnabled ? "ON" : "OFF"}
          </button>

          {disabled && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* D-Pad & Controls with visual WASD feedback */}
        <div className="flex items-center justify-center gap-6 my-1">
          {/* Enhanced D-Pad with WASD indicators */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />

            {/* FORWARD (W / ArrowUp) */}
            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(0, 1)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className={cn(
                "absolute top-1 left-1/2 -translate-x-1/2 w-9 h-11 border rounded-t-xl flex flex-col items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95",
                isWPressed
                  ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 scale-95"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
              title="Drive Forward (W / ↑)"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black leading-none mt-0.5 font-mono">W</span>
            </button>

            {/* REVERSE (S / ArrowDown) */}
            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(0, -1)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 w-9 h-11 border rounded-b-xl flex flex-col items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95",
                isSPressed
                  ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 scale-95"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
              title="Drive Reverse (S / ↓)"
            >
              <span className="text-[9px] font-black leading-none mb-0.5 font-mono">S</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* LEFT (A / ArrowLeft) */}
            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(-1, 0)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className={cn(
                "absolute left-1 top-1/2 -translate-y-1/2 w-11 h-9 border rounded-l-xl flex items-center justify-center gap-0.5 disabled:opacity-40 shadow-sm transition-all active:scale-95",
                isAPressed
                  ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 scale-95"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
              title="Steer Left (A / ←)"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black font-mono">A</span>
            </button>

            {/* RIGHT (D / ArrowRight) */}
            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(1, 0)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 w-11 h-9 border rounded-r-xl flex items-center justify-center gap-0.5 disabled:opacity-40 shadow-sm transition-all active:scale-95",
                isDPressed
                  ? "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200 scale-95"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              )}
              title="Steer Right (D / →)"
            >
              <span className="text-[9px] font-black font-mono">D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Center Stop / Brake (Space) */}
            <button
              disabled={disabled}
              onClick={() => sendDrive(0, 0)}
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 border rounded-full flex flex-col items-center justify-center shadow-inner transition-colors",
                isBrakePressed
                  ? "bg-red-500 border-red-600 text-white scale-95"
                  : "bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 border-gray-200"
              )}
              title="Brake / Stop (Spacebar)"
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors",
                  isBrakePressed ? "bg-white" : "bg-gray-400"
                )}
              />
              <span className="text-[6px] font-black uppercase mt-0.5">STOP</span>
            </button>
          </div>

          {/* Quick Info & Light Toggle */}
          <div className="flex flex-col gap-2.5 text-xs">
            {/* WASD Keyboard Hint Card */}
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-500 space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1">
                <Keyboard className="w-3 h-3 text-orange-500" />
                Keyboard Controls
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                <div><span className="font-mono font-bold text-gray-800 bg-white px-1 py-0.2 rounded border border-gray-200">W</span> Forward</div>
                <div><span className="font-mono font-bold text-gray-800 bg-white px-1 py-0.2 rounded border border-gray-200">S</span> Reverse</div>
                <div><span className="font-mono font-bold text-gray-800 bg-white px-1 py-0.2 rounded border border-gray-200">A</span> Left</div>
                <div><span className="font-mono font-bold text-gray-800 bg-white px-1 py-0.2 rounded border border-gray-200">D</span> Right</div>
              </div>
              <div className="text-[9px] text-gray-400 pt-0.5 border-t border-gray-200/60">
                <span className="font-mono font-bold text-gray-700 bg-white px-1 rounded border border-gray-200">Space</span> Brake
              </div>
            </div>

            {/* Headlight Toggle Button */}
            <button
              onClick={toggleLight}
              disabled={disabled}
              className={cn(
                "px-3 py-2 border rounded-xl text-xs font-bold disabled:opacity-40 transition-colors shadow-sm flex items-center justify-center gap-1.5",
                lightOn
                  ? "bg-yellow-100 border-yellow-300 text-yellow-700 shadow-yellow-100"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {lightOn ? "LIGHT ON" : "LIGHT OFF"}
            </button>
          </div>
        </div>

        {/* Camera Pan Gimbal */}
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500 font-bold uppercase">ESP32-CAM Pan Angle</span>
            <span className="text-gray-400 font-mono">Center (0°)</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            defaultValue="0"
            onChange={(e) => setPan(parseFloat(e.target.value))}
            onMouseUp={(e) => {
              e.currentTarget.value = "0";
              setPan(0);
            }}
            onTouchEnd={(e) => {
              e.currentTarget.value = "0";
              setPan(0);
            }}
            disabled={disabled}
            className="w-full accent-orange-500 disabled:opacity-40 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
