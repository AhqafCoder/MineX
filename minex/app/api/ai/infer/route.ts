import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const res = await fetch("http://127.0.0.1:8001/detect_pose", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: arrayBuffer,
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Inference failed" }, { status: 502 });
  } catch (err) {
    return NextResponse.json(
      { error: `AI Vision Server offline: ${String(err)}` },
      { status: 503 }
    );
  }
}
