import { NextRequest, NextResponse } from "next/server";
import { getVisitTimes, getAllVisitTimes, getVisits } from "../../redis";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.STATS_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const startParam = req.nextUrl.searchParams.get("start");
  const endParam = req.nextUrl.searchParams.get("end");

  const endMs = endParam ? Number(endParam) : Date.now();
  const [timestamps, total] = await Promise.all([
    startParam ? getVisitTimes(Number(startParam), endMs) : getAllVisitTimes(),
    getVisits(),
  ]);

  return NextResponse.json({ timestamps, total });
}
