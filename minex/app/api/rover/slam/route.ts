import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "http://winner.local:8080";
  try {
    const res = await fetch(`${ip}/slam_data`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "offline", points: [], offset: 0 }, { status: 502 });
  }
}
