import { spawnSync } from 'node:child_process';
import path from 'node:path';

const script = path.join(process.cwd(), 'scripts/create-admin.js');
const cleanEnvironment = (overrides) => ({
  PATH: process.env.PATH,
  ADMIN_EMAIL: '',
  ADMIN_PASSWORD: '',
  ...overrides,
});

describe('admin provisioning script safety', () => {
  it('requires an explicit admin email instead of using a fallback', () => {
    const result = spawnSync(process.execPath, [script], {
      env: cleanEnvironment({ ADMIN_PASSWORD: 'a-strong-test-password-123' }),
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Set one valid ADMIN_EMAIL address');
    expect(result.stderr).not.toContain('tksunaria@gmail.com');
  });

  it('rejects weak passwords before creating a database client', () => {
    const result = spawnSync(process.execPath, [script], {
      env: cleanEnvironment({ ADMIN_EMAIL: 'admin@example.test', ADMIN_PASSWORD: 'short' }),
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('at least 16 characters');
  });
});
