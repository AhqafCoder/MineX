import { NextRequest, NextResponse } from "next/server";
import { normalizeRoverUrl, fetchWithTimeout } from "@/lib/rover-api";

export async function POST(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || "";
  const targetUrl = normalizeRoverUrl(ip);
  
  try {
    const res = await fetchWithTimeout(`${targetUrl}/toggle_record`, { method: "POST" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "offline", details: String(error) }, { status: 502 });
  }
}
