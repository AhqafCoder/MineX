import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "http://winner.local:8080";
  try {
    const body = await req.json();
    const res = await fetch(`${ip}/servo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "offline" }, { status: 502 });
  }
}
