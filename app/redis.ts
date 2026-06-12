import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function trackVisit(token: string): Promise<void> {
  const isNew = await redis.set(`fortune:token:${token}`, 1, {
    ex: 60 * 60 * 24 * 30,
    nx: true,
  });
  if (isNew) {
    await Promise.all([
      redis.incr("fortune:visits"),
      redis.zadd("fortune:visit_times", { score: Date.now(), member: token }),
    ]);
  }
}

export async function getVisits(): Promise<number> {
  return (await redis.get<number>("fortune:visits")) ?? 0;
}

function extractScores(raw: unknown[]): number[] {
  // flat array from Redis WITHSCORES: [member, score, member, score, ...]
  // @upstash/redis auto-parses numeric strings, so scores are already numbers
  const scores: number[] = [];
  for (let i = 1; i < raw.length; i += 2) {
    scores.push(Number(raw[i]));
  }
  return scores.sort((a, b) => a - b);
}

export async function getVisitTimes(startMs: number, endMs: number): Promise<number[]> {
  const raw = await redis.zrange<unknown[]>("fortune:visit_times", startMs, endMs, {
    byScore: true,
    withScores: true,
  });
  return extractScores(raw);
}

export async function getAllVisitTimes(): Promise<number[]> {
  const raw = await redis.zrange<unknown[]>("fortune:visit_times", 0, -1, {
    withScores: true,
  });
  return extractScores(raw);
}

export async function resetVisits(): Promise<void> {
  await redis.set("fortune:visits", 0);
}
