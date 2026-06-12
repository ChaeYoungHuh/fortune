import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../redis";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.STATS_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Scan all fortune:token:* keys
  const tokens: string[] = [];
  let cursor = 0;
  do {
    const [nextCursor, batch] = await redis.scan(cursor, {
      match: "fortune:token:*",
      count: 100,
    });
    cursor = Number(nextCursor);
    tokens.push(...batch);
  } while (cursor !== 0);

  if (tokens.length === 0) {
    return NextResponse.json({ inserted: 0, total: 0 });
  }

  // Get TTL for all tokens in parallel batches
  const now = Date.now();
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);

    // Use pipeline to get all TTLs at once
    const pipeline = redis.pipeline();
    for (const token of batch) {
      pipeline.pttl(token); // millisecond precision TTL
    }
    const ttls = await pipeline.exec<number[]>();

    // Add to sorted set if not already present
    const zadds = redis.pipeline();
    for (let j = 0; j < batch.length; j++) {
      const token = batch[j];
      const ttlMs = ttls[j];
      if (ttlMs <= 0) continue; // expired or no TTL

      // Estimate creation time from remaining TTL
      const estimatedCreatedMs = now - (THIRTY_DAYS_MS - ttlMs);
      const member = token.replace("fortune:token:", "");

      // NX: only add if not already in the set
      zadds.zadd("fortune:visit_times", { nx: true }, { score: estimatedCreatedMs, member });
    }
    await zadds.exec();
    inserted += batch.length;
  }

  return NextResponse.json({ inserted: tokens.length, total: tokens.length });
}
