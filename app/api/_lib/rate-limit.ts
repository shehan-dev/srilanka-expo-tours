import "server-only";

// Best-effort, in-memory rate limiter (per server instance). Stops simple form spam;
// for strict limits across many serverless instances use a shared store such as Upstash Redis.

const hits = new Map<string, number[]>();

export function rateLimit(key: string, { limit = 5, windowMs = 10 * 60_000 } = {}) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return { allowed: true, retryAfter: 0 };
}

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
