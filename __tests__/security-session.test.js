import bcrypt from 'bcrypt';

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { user: { findUnique: jest.fn(), updateMany: jest.fn() } },
}));
jest.mock('@/lib/bot-protection', () => ({ verifyPublicSubmission: jest.fn(async () => ({ allowed: true })) }));

const prisma = require('@/lib/prisma').default;
const { verifyPublicSubmission } = require('@/lib/bot-protection');
const originalSecret = process.env.SECRET_COOKIE_PASSWORD;
process.env.SECRET_COOKIE_PASSWORD = 'local-test-only-cookie-secret-at-least-32-characters';
const login = require('../pages/api/login').default;
const logout = require('../pages/api/logout').default;
const whoami = require('../pages/api/user').default;
const { withAdminRoute, hasSameOrigin, default: options } = require('@/lib/session');
const testDb = require('../pages/api/test-db').default;
const payments = require('../pages/api/get-payments').default;

let account;
let nextIp = 1;
const password = 'local-test-password-1234';

function request(method = 'GET', overrides = {}) {
  return {
    method,
    headers: { host: 'example.test', origin: 'https://example.test' },
    socket: { remoteAddress: `192.0.2.${nextIp++}` },
    ...overrides,
  };
}
function response() {
  const headers = {};
  return {
    headers,
    setHeader: jest.fn((name, value) => { headers[name.toLowerCase()] = value; }),
    getHeader: jest.fn((name) => headers[name.toLowerCase()]),
    status: jest.fn(function (status) { this.statusCode = status; return this; }),
    json: jest.fn(function (body) { this.body = body; return this; }),
    end: jest.fn(function () { return this; }),
  };
}
function getCookie(res) {
  const value = res.headers['set-cookie'];
  return (Array.isArray(value) ? value[0] : value).split(';')[0];
}
async function signIn() {
  const res = response();
  await login(request('POST', { body: { email: account.email, password } }), res);
  expect(res.statusCode).toBe(200);
  return { res, cookie: getCookie(res) };
}
function authenticated(method, cookie, extra = {}) {
  return request(method, {
    headers: { host: 'example.test', origin: 'https://example.test', cookie },
    ...extra,
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  account = {
    id: 'test-user-1', email: 'admin@example.test', name: 'Example Admin', role: 'ADMIN',
    password: await bcrypt.hash(password, 4), sessionVersion: 0, updatedAt: new Date('2025-01-02T03:04:05.000Z'),
  };
  prisma.user.findUnique.mockImplementation(async ({ where }) =>
    account && (where.id === account.id || where.email === account.email) ? { ...account } : null
  );
  prisma.user.updateMany.mockImplementation(async ({ where, data }) => {
    if (account && where.id === account.id && where.updatedAt.getTime() === account.updatedAt.getTime() && where.sessionVersion === account.sessionVersion) {
      account.sessionVersion += data.sessionVersion.increment;
      account.updatedAt = new Date(Math.max(Date.now(), account.updatedAt.getTime() + 1));
      return { count: 1 };
    }
    return { count: 0 };
  });
  verifyPublicSubmission.mockResolvedValue({ allowed: true });
});
afterAll(() => {
  if (originalSecret === undefined) delete process.env.SECRET_COOKIE_PASSWORD;
  else process.env.SECRET_COOKIE_PASSWORD = originalSecret;
});

describe('admin authentication and CSRF', () => {
  it('uses HttpOnly, SameSite cookies with an explicit short sealed-token lifetime', async () => {
    const { res } = await signIn();
    const cookie = res.headers['set-cookie'].join('; ');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(options.ttl).toBe(8 * 60 * 60);
    expect(res.body.user).not.toHaveProperty('sessionVersion');
    expect(res.headers['cache-control']).toContain('no-store');
  });

  it('requires the exact same origin for login and authenticated writes', async () => {
    const { cookie } = await signIn();
    const protectedWrite = withAdminRoute(async (_req, res) => res.status(200).json({ ok: true }));
    for (const origin of [undefined, 'null', 'https://evil.test', 'https://example.test.evil.test', 'https://example.test/path']) {
      const headers = { host: 'example.test', cookie };
      if (origin !== undefined) headers.origin = origin;
      const res = response();
      await protectedWrite(request('POST', { headers }), res);
      expect(res.statusCode).toBe(403);
    }
    const okay = response();
    await protectedWrite(authenticated('POST', cookie), okay);
    expect(okay.statusCode).toBe(200);

    const loginRes = response();
    await login(request('POST', { headers: { host: 'example.test', origin: 'https://evil.test' }, body: { email: account.email, password } }), loginRes);
    expect(loginRes.statusCode).toBe(403);
    expect(hasSameOrigin({ headers: { host: 'example.test', origin: 'https://example.test' } })).toBe(true);
  });

  it('rejects malformed credentials and a bot before querying the database', async () => {
    for (const body of [null, { email: { equals: account.email }, password }, { email: account.email, password: 'x'.repeat(73) }]) {
      const res = response();
      await login(request('POST', { body }), res);
      expect(res.statusCode).toBe(400);
    }
    verifyPublicSubmission.mockResolvedValue({ allowed: false, status: 403 });
    const blocked = response();
    await login(request('POST', { body: { email: account.email, password } }), blocked);
    expect(blocked.statusCode).toBe(403);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('rechecks role, account existence and version rather than trusting a signed cookie', async () => {
    const { cookie } = await signIn();
    const protectedRead = withAdminRoute(async (_req, res) => res.status(200).json({ ok: true }));
    const success = response();
    await protectedRead(authenticated('GET', cookie), success);
    expect(success.statusCode).toBe(200);

    account.role = 'CUSTOMER'; // Even a direct role change without an updated timestamp is reflected.
    const downgraded = response();
    await protectedRead(authenticated('GET', cookie), downgraded);
    expect(downgraded.statusCode).toBe(403);
    account.role = 'ADMIN';
    account.updatedAt = new Date(account.updatedAt.getTime() + 1);
    const changed = response();
    await protectedRead(authenticated('GET', cookie), changed);
    expect(changed.statusCode).toBe(401);
    account = null;
    const deleted = response();
    await protectedRead(authenticated('GET', cookie), deleted);
    expect(deleted.statusCode).toBe(401);
  });

  it('revokes a stolen cookie and other sessions on logout; replay cannot revoke a newer session', async () => {
    const first = await signIn();
    const second = await signIn();
    const out = response();
    await logout(authenticated('POST', first.cookie), out);
    expect(out.statusCode).toBe(200);
    expect(out.headers['set-cookie'].join('; ')).toContain('Max-Age=0');
    const old = response();
    await whoami(authenticated('GET', second.cookie), old);
    expect(old.body.user).toBeNull();

    const newer = await signIn();
    const replay = response();
    await logout(authenticated('POST', first.cookie), replay);
    const current = response();
    await whoami(authenticated('GET', newer.cookie), current);
    expect(current.body.user.role).toBe('ADMIN');
  });

  it('reports failed server-side logout revocation instead of claiming full success', async () => {
    const { cookie } = await signIn();
    prisma.user.updateMany.mockRejectedValueOnce(new Error('private database detail'));
    const res = response();
    await logout(authenticated('POST', cookie), res);
    expect(res.statusCode).toBe(503);
    expect(res.headers['set-cookie'].join('; ')).toContain('Max-Age=0');
    expect(JSON.stringify(res.body)).not.toContain('private database detail');
  });

  it('keeps diagnostics and payment placeholders inaccessible without an admin session', async () => {
    for (const handler of [testDb, payments]) {
      const res = response();
      await handler(request('GET'), res);
      expect(res.statusCode).toBe(401);
    }
  });
});
