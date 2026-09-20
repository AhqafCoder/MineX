import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "http://winner.local:8080";
  try {
    const upstream = await fetch(`${ip}/video_feed`, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) {
      return new Response("No video stream available", { status: 502 });
    }

    // Stream-through the MJPEG feed from the rover
    return new Response(upstream.body, {
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "multipart/x-mixed-replace; boundary=frame",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Connection": "keep-alive",
      },
    });
  } catch {
    return new Response("Rover offline", { status: 502 });
  }
}
