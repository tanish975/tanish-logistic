jest.mock('botid/client/core', () => ({ initBotId: jest.fn() }));
jest.mock('botid/next/config', () => ({ withBotId: jest.fn((config) => config) }));

const envNames = ['VERCEL', 'VERCEL_ENV', 'NEXT_PUBLIC_CONTACT_BOTID'];
const originalEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));

beforeEach(() => {
  jest.resetModules();
  for (const name of envNames) delete process.env[name];
});

afterAll(() => {
  for (const name of envNames) {
    if (originalEnv[name] === undefined) delete process.env[name];
    else process.env[name] = originalEnv[name];
  }
});

describe('contact BotID configuration', () => {
  it('enables browser protection automatically for Vercel builds', () => {
    process.env.VERCEL = '1';
    process.env.NEXT_PUBLIC_CONTACT_BOTID = '0';
    const { default: config } = require('../next.config');
    const { withBotId } = require('botid/next/config');
    expect(config.env.NEXT_PUBLIC_CONTACT_BOTID).toBe('1');
    expect(withBotId).toHaveBeenCalledWith(expect.objectContaining({ trailingSlash: true }));
  });

  it('also enables it when VERCEL_ENV identifies a preview', () => {
    process.env.VERCEL_ENV = 'preview';
    const { default: config } = require('../next.config');
    expect(config.env.NEXT_PUBLIC_CONTACT_BOTID).toBe('1');
  });

  it('skips the browser challenge on non-Vercel builds by default', () => {
    const { default: config } = require('../next.config');
    expect(config.env.NEXT_PUBLIC_CONTACT_BOTID).toBe('0');
    process.env.NEXT_PUBLIC_CONTACT_BOTID = '0';
    require('../instrumentation-client');
    const { initBotId } = require('botid/client/core');
    expect(initBotId).not.toHaveBeenCalled();
  });

  it('allows an external build to opt in for later deployment to Vercel', () => {
    process.env.NEXT_PUBLIC_CONTACT_BOTID = '1';
    const { default: config } = require('../next.config');
    expect(config.env.NEXT_PUBLIC_CONTACT_BOTID).toBe('1');
  });

  it('protects public submission POST paths using Basic rather than paid Deep Analysis', () => {
    process.env.NEXT_PUBLIC_CONTACT_BOTID = '1';
    require('../instrumentation-client');
    const { initBotId } = require('botid/client/core');
    expect(initBotId).toHaveBeenCalledWith({
      protect: [
        { path: '/api/send-email', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/send-email/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/add-booking', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/add-booking/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/reviews', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/reviews/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/login', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/login/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      ],
    });
  });
});
