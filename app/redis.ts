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
    await redis.incr("fortune:visits");
  }
}

export async function getVisits(): Promise<number> {
  return (await redis.get<number>("fortune:visits")) ?? 0;
}
