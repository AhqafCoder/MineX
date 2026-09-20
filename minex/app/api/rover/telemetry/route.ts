import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "http://winner.local:8080";
  try {
    const res = await fetch(`${ip}/telemetry`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "offline" }, { status: 502 });
  }
}
