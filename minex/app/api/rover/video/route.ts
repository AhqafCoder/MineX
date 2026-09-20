import { NextRequest } from "next/server";
import { normalizeRoverUrl, fetchWithTimeout } from "@/lib/rover-api";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "";
  const targetUrl = normalizeRoverUrl(ip);
  
  try {
    const upstream = await fetchWithTimeout(`${targetUrl}/video_feed`, { 
      cache: "no-store",
      timeout: 5000 // slightly longer timeout for video stream initialization
    });
    
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
  } catch (error) {
    return new Response(`Rover offline: ${String(error)}`, { status: 502 });
  }
}
