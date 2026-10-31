jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    review: { create: jest.fn(), update: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
  },
}));
jest.mock('iron-session', () => ({ getIronSession: jest.fn() }));
jest.mock('@/lib/bot-protection', () => ({ verifyPublicSubmission: jest.fn(async () => ({ allowed: true })) }));

const prisma = require('@/lib/prisma').default;
const { getIronSession } = require('iron-session');
const { verifyPublicSubmission } = require('@/lib/bot-protection');
const secret = process.env.SECRET_COOKIE_PASSWORD;
process.env.SECRET_COOKIE_PASSWORD = 'local-test-only-cookie-secret-at-least-32-characters';
const handler = require('../pages/api/reviews').default;
let ip = 1;
const version = new Date('2025-01-01T00:00:00.000Z');
const account = { id: 'admin', email: 'admin@example.test', name: 'Admin', role: 'ADMIN', sessionVersion: 0, updatedAt: version };
function req(method, body, origin = 'https://example.test') {
  return { method, body, query: {}, headers: { host: 'example.test', ...(origin ? { origin } : {}) }, socket: { remoteAddress: `203.0.113.${ip++}` } };
}
function res() {
  return { setHeader: jest.fn(), status: jest.fn(function (code) { this.code = code; return this; }), json: jest.fn(function (body) { this.body = body; return this; }) };
}
function admin() {
  getIronSession.mockResolvedValue({ user: { id: account.id, sessionVersion: 0, accountUpdatedAt: version.toISOString() } });
  prisma.user.findUnique.mockResolvedValue(account);
}
beforeEach(() => {
  jest.clearAllMocks();
  getIronSession.mockResolvedValue({});
  verifyPublicSubmission.mockResolvedValue({ allowed: true });
  prisma.review.create.mockResolvedValue({ id: 'review-1' });
  prisma.review.update.mockResolvedValue({ id: 'review-1' });
});
afterAll(() => {
  if (secret === undefined) delete process.env.SECRET_COOKIE_PASSWORD;
  else process.env.SECRET_COOKIE_PASSWORD = secret;
});

describe('review moderation security', () => {
  it('never accepts public moderation, publication, platform or date values', async () => {
    const response = res();
    await handler(req('POST', { name: 'Test User', rating: 5, comment: 'Good work', status: 'approved', isPublic: true, platform: 'Google', date: '2000-01-01' }), response);
    expect(response.code).toBe(201);
    expect(prisma.review.create.mock.calls[0][0].data).toEqual(expect.objectContaining({
      status: 'pending', isPublic: false, platform: 'Site',
    }));
    expect(prisma.review.create.mock.calls[0][0].data.date.toISOString()).not.toBe('2000-01-01T00:00:00.000Z');
  });

  it.each([0, 6, 2.5, '5', null])('rejects invalid rating %p', async (rating) => {
    const response = res();
    await handler(req('POST', { name: 'User', rating, comment: 'Good' }), response);
    expect(response.code).toBe(400);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('blocks bots before creating a public review', async () => {
    verifyPublicSubmission.mockResolvedValue({ allowed: false, status: 403 });
    const response = res();
    await handler(req('POST', { name: 'User', rating: 5, comment: 'Good' }), response);
    expect(response.code).toBe(403);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it('allows a valid admin to add an external review only from the same origin, still pending', async () => {
    admin();
    const response = res();
    await handler(req('POST', { rating: 5, comment: 'Good', platform: 'Trustpilot', date: '2026-01-01', status: 'approved' }), response);
    expect(response.code).toBe(201);
    expect(prisma.review.create.mock.calls[0][0].data).toEqual(expect.objectContaining({ platform: 'Trustpilot', status: 'pending', isPublic: false }));
    const blocked = res();
    await handler(req('POST', { rating: 5, comment: 'Good', platform: 'Google' }, 'https://evil.test'), blocked);
    expect(blocked.code).toBe(403);
  });

  it('rejects cross-origin, anonymous, deleted or demoted moderation requests', async () => {
    admin();
    const crossOrigin = res();
    await handler(req('PUT', { id: 'review-1', status: 'approved' }, 'https://evil.test'), crossOrigin);
    expect(crossOrigin.code).toBe(403);
    getIronSession.mockResolvedValue({});
    const anonymous = res();
    await handler(req('PUT', { id: 'review-1', status: 'approved' }), anonymous);
    expect(anonymous.code).toBe(401);
    admin();
    prisma.user.findUnique.mockResolvedValue(null);
    const deleted = res();
    await handler(req('DELETE', { id: 'review-1' }), deleted);
    expect(deleted.code).toBe(401);
    expect(prisma.review.update).not.toHaveBeenCalled();
    expect(prisma.review.delete).not.toHaveBeenCalled();
  });

  it('publishes only explicit admin approvals and unpublishes rejected reviews', async () => {
    admin();
    for (const status of ['approved', 'rejected', 'pending']) {
      const response = res();
      await handler(req('PUT', { id: 'review-1', status, isPublic: true }), response);
      expect(response.code).toBe(200);
      expect(prisma.review.update).toHaveBeenLastCalledWith({ where: { id: 'review-1' }, data: { status, isPublic: status === 'approved' } });
    }
    const invalid = res();
    await handler(req('PUT', { id: 'review-1', status: 'anything' }), invalid);
    expect(invalid.code).toBe(400);
  });
});
