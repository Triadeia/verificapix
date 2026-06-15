const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = Number(process.env.RATE_LIMIT_UPLOAD_PER_MIN ?? 10);

export function checkRateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true, remaining: LIMIT - 1 };
  }
  bucket.count += 1;
  return { ok: bucket.count <= LIMIT, remaining: Math.max(0, LIMIT - bucket.count) };
}
