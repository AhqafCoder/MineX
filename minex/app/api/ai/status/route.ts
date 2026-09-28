import { NextResponse } from "next/server";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch("http://127.0.0.1:8001/status", {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({
      status: "offline",
      message: "AI Vision Server returned non-200",
      device: "unknown",
      fps: 0,
      latency_ms: 0,
      persons_detected: 0,
    });
  } catch {
    return NextResponse.json({
      status: "offline",
      message: "AI Vision Server is offline. Run 'npm run ai' or 'python3 ai_pose_service.py' to start YOLOv8 pose engine.",
      device: "none",
      fps: 0,
      latency_ms: 0,
      persons_detected: 0,
    });
  }
}
