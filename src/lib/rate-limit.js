import { isIP } from 'node:net';

/**
 * In-memory sliding-window rate limiter for Next.js API routes.
 *
 * NOTE: on serverless platforms (Vercel) each lambda instance keeps its own
 * counters, so this is best-effort per-instance protection — still a large
 * improvement over nothing. For strict global limits, back this with Redis
 * (e.g. Upstash) later.
 */

const buckets = new Map();
const MAX_BUCKETS = 20_000;

// Periodically evict stale buckets so the Map cannot grow unbounded.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, timestamps] of buckets) {
    const fresh = timestamps.filter((t) => now - t < 60 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

export function getClientIp(req) {
  // Vercel overwrites its forwarded client-IP header at the edge. Elsewhere,
  // ignore client-supplied forwarding headers unless an operator explicitly
  // enables them behind a proxy that strips and replaces incoming headers.
  const vercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL_ENV) ||
    typeof globalThis[Symbol.for('@vercel/request-context')]?.get === 'function';
  if (vercel || process.env.TRUST_PROXY_IP_HEADERS === '1') {
    const forwarded = req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      const candidate = forwarded.split(',')[0].trim();
      if (isIP(candidate)) return candidate;
    }
  }
  const address = req.socket?.remoteAddress || req.connection?.remoteAddress;
  return typeof address === 'string' && isIP(address) ? address : 'unknown';
}

/**
 * @param {string} key      Unique bucket key (e.g. `login:1.2.3.4`)
 * @param {number} limit    Max requests allowed in the window
 * @param {number} windowMs Window size in milliseconds
 * @returns {{ allowed: boolean, remaining: number, retryAfterSec: number }}
 */
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  sweep(now);

  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, timestamps);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  // Bound memory use under traffic from many distinct addresses. This does
  // not make the per-instance limiter a substitute for a shared WAF limit.
  if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) {
    buckets.delete(buckets.keys().next().value);
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length, retryAfterSec: 0 };
}

/**
 * Wraps an API handler with a per-IP rate limit.
 *
 * @param {Function} handler            Next.js API handler (req, res)
 * @param {{ limit: number, windowMs: number, name?: string }} options
 */
export function withRateLimit(handler, { limit, windowMs, name = 'request' }) {
  return async function rateLimitedHandler(req, res) {
    const result = checkRateLimit(`${name}:${getClientIp(req)}`, limit, windowMs);
    res.setHeader('X-RateLimit-Remaining', String(result.remaining));

    if (!result.allowed) {
      res.setHeader('Retry-After', String(result.retryAfterSec));
      return res.status(429).json({
        message: `Too many ${name} requests. Please try again in ${result.retryAfterSec} second(s).`,
      });
    }

    return handler(req, res);
  };
}
