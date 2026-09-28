import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const source = searchParams.get("source") || "rover";
  const roverIp = searchParams.get("rover_ip") || "http://winner.local:8080";
  const conf = searchParams.get("conf") || "0.35";
  const rotation = searchParams.get("rotation") || "0";

  const targetUrl = `http://127.0.0.1:8001/annotated_feed?source=${encodeURIComponent(
    source
  )}&rover_ip=${encodeURIComponent(roverIp)}&conf=${encodeURIComponent(
    conf
  )}&rotation=${encodeURIComponent(rotation)}`;

  try {
    const upstream = await fetch(targetUrl, {
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return new Response("AI Vision Stream unavailable", { status: 502 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") ||
          "multipart/x-mixed-replace; boundary=frame",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      `AI Vision Server offline: ${String(
        error
      )}. Run 'npm run ai' or 'python3 ai_pose_service.py' to start.`,
      { status: 502 }
    );
  }
}
