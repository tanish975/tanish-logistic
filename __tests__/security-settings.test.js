jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: { siteSettings: { findUnique: jest.fn(), upsert: jest.fn() } },
}));
jest.mock('@/lib/session', () => ({
  withAdminRoute: (handler) => handler, // Authorization is exercised separately with real signed cookies.
}));
const prisma = require('@/lib/prisma').default;
const { validateSettings, publicSiteSettings, readSiteSettings } = require('@/lib/site-settings');
const adminSettings = require('../pages/api/settings/general').default;
const publicSettings = require('../pages/api/settings').default;
function makeResponse() {
  return {
    setHeader: jest.fn(), status: jest.fn(function (code) { this.code = code; return this; }),
    json: jest.fn(function (body) { this.body = body; return this; }), end: jest.fn(),
  };
}
beforeEach(() => {
  jest.clearAllMocks();
  prisma.siteSettings.findUnique.mockResolvedValue({ data: {
    siteName: 'Demo', primaryColor: '#123456', logoUrl: '/logo.svg',
    paymentApiKey: 'do-not-expose-this-test-value', passwordPolicy: 'not-a-real-policy',
    commentModeration: 'manual',
  } });
});

describe('durable and secret-free settings', () => {
  it('never reads legacy secrets into public or admin responses', async () => {
    const data = await readSiteSettings();
    expect(JSON.stringify(data)).not.toContain('do-not-expose-this-test-value');
    expect(data).not.toHaveProperty('paymentApiKey');
    const publicData = publicSiteSettings(data);
    expect(publicData).not.toHaveProperty('commentModeration');
    const publicResponse = makeResponse();
    await publicSettings({ method: 'GET' }, publicResponse);
    expect(publicResponse.code).toBe(200);
    expect(JSON.stringify(publicResponse.body)).not.toContain('do-not-expose-this-test-value');
  });

  it('rejects secrets, prototype keys, unsafe logo URLs and malformed values', () => {
    expect(validateSettings({ paymentApiKey: 'test-only' })).toBeNull();
    expect(validateSettings(JSON.parse('{"__proto__":"danger"}'))).toBeNull();
    expect(validateSettings({ logoUrl: 'javascript:alert(1)' })).toBeNull();
    expect(validateSettings({ logoUrl: '//evil.test/logo.png' })).toBeNull();
    expect(validateSettings({ primaryColor: 'red; background:url(evil)' })).toBeNull();
    expect(validateSettings({ logoUrl: 'https://store-1.public.blob.vercel-storage.com/logos/logo.png' })).not.toBeNull();
  });

  it('stores only allowlisted settings in the shared database', async () => {
    const response = makeResponse();
    await adminSettings({ method: 'POST', body: { siteName: 'Updated name', primaryColor: '#abc' } }, response);
    expect(response.code).toBe(200);
    const data = prisma.siteSettings.upsert.mock.calls[0][0].update.data;
    expect(data.siteName).toBe('Updated name');
    expect(data).not.toHaveProperty('paymentApiKey');
    expect(data).not.toHaveProperty('passwordPolicy');
  });

  it('rejects attempted secret writes instead of storing them', async () => {
    const response = makeResponse();
    await adminSettings({ method: 'POST', body: { paymentApiKey: 'test-only' } }, response);
    expect(response.code).toBe(400);
    expect(prisma.siteSettings.upsert).not.toHaveBeenCalled();
  });

  it('fails rather than displaying editable fake defaults if the database is down', async () => {
    prisma.siteSettings.findUnique.mockRejectedValue(new Error('private connection detail'));
    const response = makeResponse();
    await adminSettings({ method: 'GET' }, response);
    expect(response.code).toBe(503);
    expect(JSON.stringify(response.body)).not.toContain('private connection detail');
  });
});
