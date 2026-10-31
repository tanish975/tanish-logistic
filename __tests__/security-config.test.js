jest.mock('botid/next/config', () => ({ withBotId: (config) => config }));
const fs = require('node:fs');
const path = require('node:path');
const originalNodeEnv = process.env.NODE_ENV;
afterAll(() => { process.env.NODE_ENV = originalNodeEnv; });

describe('production HTTP security headers', () => {
  it('retires the public legacy admin demo and links only to the protected app', () => {
    const legacyAdmin = fs.readFileSync(path.join(process.cwd(), 'public/admin.html'), 'utf8');
    expect(legacyAdmin).toContain('content="0; url=/admin/"');
    expect(legacyAdmin).toContain('href="/admin/"');
    expect(legacyAdmin.toLowerCase()).not.toContain('<script');
    expect(legacyAdmin.toLowerCase()).not.toContain('firebase');
  });

  it('adds browser hardening and prevents admin/API caching', async () => {
    jest.resetModules();
    process.env.NODE_ENV = 'production';
    const config = require('../next.config').default;
    const rules = await config.headers();
    const global = Object.fromEntries(rules.find((rule) => rule.source === '/:path*').headers.map(({ key, value }) => [key, value]));
    expect(config.poweredByHeader).toBe(false);
    expect(global['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(global['Content-Security-Policy']).toContain("object-src 'none'");
    expect(global['Content-Security-Policy']).not.toContain("'unsafe-eval'");
    expect(global['Strict-Transport-Security']).toBe('max-age=31536000');
    expect(global['X-Frame-Options']).toBe('DENY');
    expect(global['X-Content-Type-Options']).toBe('nosniff');
    for (const source of ['/api/:path*', '/admin/:path*', '/settings/:path*', '/login/:path*']) {
      expect(rules.find((rule) => rule.source === source).headers).toContainEqual({ key: 'Cache-Control', value: 'private, no-store' });
    }
  });
});
