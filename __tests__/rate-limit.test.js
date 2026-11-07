import { checkRateLimit, getClientIp, withRateLimit } from '../src/lib/rate-limit';

describe('checkRateLimit', () => {
  it('allows requests under the limit and blocks over it', () => {
    const key = `test-under-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThanOrEqual(1);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it('recovers after the window passes', () => {
    const key = `test-recover-${Math.random()}`;
    const realNow = Date.now;
    let now = realNow();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    try {
      for (let i = 0; i < 3; i += 1) checkRateLimit(key, 3, 1_000);
      expect(checkRateLimit(key, 3, 1_000).allowed).toBe(false);

      now += 1_500; // past the 1s window
      expect(checkRateLimit(key, 3, 1_000).allowed).toBe(true);
    } finally {
      Date.now.mockRestore();
    }
  });
});

describe('getClientIp', () => {
  it('ignores spoofed forwarded addresses on an untrusted direct connection', () => {
    const req = { headers: { 'x-forwarded-for': '1.2.3.4' }, socket: { remoteAddress: '9.9.9.9' } };
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  it('uses a validated Vercel client IP on Vercel', () => {
    const previous = process.env.VERCEL;
    process.env.VERCEL = '1';
    try {
      const req = { headers: { 'x-vercel-forwarded-for': '1.2.3.4', 'x-forwarded-for': '5.6.7.8' }, socket: { remoteAddress: '9.9.9.9' } };
      expect(getClientIp(req)).toBe('1.2.3.4');
      req.headers['x-vercel-forwarded-for'] = 'not-an-ip';
      expect(getClientIp(req)).toBe('9.9.9.9');
    } finally {
      if (previous === undefined) delete process.env.VERCEL;
      else process.env.VERCEL = previous;
    }
  });

  it('falls back to socket address', () => {
    const req = { headers: {}, socket: { remoteAddress: '9.9.9.9' } };
    expect(getClientIp(req)).toBe('9.9.9.9');
  });
});

describe('withRateLimit wrapper', () => {
  const makeRes = () => ({
    headers: {},
    setHeader: jest.fn(),
    status: jest.fn(function () { return this; }),
    json: jest.fn(),
  });

  it('passes through within limit and returns 429 beyond it', async () => {
    const handler = jest.fn(async (req, res) => res.status(200).json({ ok: true }));
    const wrapped = withRateLimit(handler, { limit: 2, windowMs: 60_000, name: 'unit-test' });
    const req = { headers: { 'x-forwarded-for': '10.0.0.1' }, socket: {} };

    const r1 = makeRes();
    const r2 = makeRes();
    const r3 = makeRes();
    await wrapped(req, r1);
    await wrapped(req, r2);
    await wrapped(req, r3);

    expect(r1.status).toHaveBeenCalledWith(200);
    expect(r2.status).toHaveBeenCalledWith(200);
    expect(r3.status).toHaveBeenCalledWith(429);
    expect(r3.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Too many unit-test requests') })
    );
  });
});
