import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizeLogo } from '../src/lib/image-upload';

jest.mock('@/lib/session', () => ({ withAdminRoute: (handler) => handler }));
jest.mock('@/lib/bot-protection', () => ({ isVercelRequest: jest.fn(() => true) }));
jest.mock('@vercel/blob', () => ({ put: jest.fn() }));
jest.mock('formidable', () => ({ IncomingForm: jest.fn() }));
const { put } = require('@vercel/blob');
const { IncomingForm } = require('formidable');
const upload = require('../pages/api/upload').default;
const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
let png;
function response() {
  return { setHeader: jest.fn(), status: jest.fn(function (code) { this.code = code; return this; }), json: jest.fn(function (body) { this.body = body; return this; }), end: jest.fn() };
}
beforeAll(async () => {
  png = await sharp({ create: { width: 4, height: 4, channels: 3, background: 'red' } }).png().toBuffer();
});
beforeEach(() => {
  jest.clearAllMocks();
  process.env.BLOB_READ_WRITE_TOKEN = 'test-only-token';
  put.mockResolvedValue({ url: 'https://test.public.blob.vercel-storage.com/logos/logo.png' });
});
afterAll(() => {
  if (originalToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
  else process.env.BLOB_READ_WRITE_TOKEN = originalToken;
});

describe('logo upload safety', () => {
  it('checks decoded image format, ignores extension tricks and strips appended active content', async () => {
    const polyglot = Buffer.concat([png, Buffer.from('<script>alert(1)</script>')]);
    const normalized = await normalizeLogo(polyglot, '.png');
    expect(normalized).not.toBeNull();
    expect(normalized.includes(Buffer.from('<script>'))).toBe(false);
    expect((await sharp(normalized).metadata()).format).toBe('png');
    expect(await normalizeLogo(png, '.jpg')).toBeNull();
    expect(await normalizeLogo(Buffer.from('<svg onload="alert(1)"></svg>'), '.svg')).toBeNull();
    expect(await normalizeLogo(Buffer.from('%PDF-1.7'), '.pdf')).toBeNull();
    expect(await normalizeLogo(Buffer.from('not a png'), '.png')).toBeNull();
  });

  it('rejects decompression bombs even when the compressed image is small', async () => {
    const big = await sharp({ create: { width: 5000, height: 5000, channels: 3, background: 'white' } }).png().toBuffer();
    expect(big.length).toBeLessThan(3 * 1024 * 1024);
    expect(await normalizeLogo(big, '.png')).toBeNull();
  });

  it('refuses production uploads without durable storage, before parsing', async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    const result = response();
    await upload({ method: 'POST' }, result);
    expect(result.code).toBe(503);
    expect(IncomingForm).not.toHaveBeenCalled();
    expect(put).not.toHaveBeenCalled();
  });

  it('re-encodes an authenticated logo before uploading it to public storage', async () => {
    IncomingForm.mockImplementation(({ uploadDir }) => ({
      parse: async () => {
        const filepath = path.join(uploadDir, 'input');
        await fs.writeFile(filepath, Buffer.concat([png, Buffer.from('<script>bad</script>')]));
        return [{}, { file: [{ filepath, originalFilename: 'logo.png' }] }];
      },
    }));
    const result = response();
    await upload({ method: 'POST' }, result);
    expect(result.code).toBe(200);
    expect(put).toHaveBeenCalledTimes(1);
    const [filename, bytes, options] = put.mock.calls[0];
    expect(filename).toMatch(/^logos\/[\w-]+\.png$/);
    expect(bytes.includes(Buffer.from('<script>'))).toBe(false);
    expect(options).toEqual(expect.objectContaining({ access: 'public', contentType: 'image/png' }));
    expect(result.body.url).toContain('public.blob.vercel-storage.com');
  });

  it('rejects SVG and mismatched files without publishing them', async () => {
    IncomingForm.mockImplementation(({ uploadDir }) => ({
      parse: async () => {
        const filepath = path.join(uploadDir, 'input');
        await fs.writeFile(filepath, png);
        return [{}, { file: [{ filepath, originalFilename: 'logo.svg' }] }];
      },
    }));
    const result = response();
    await upload({ method: 'POST' }, result);
    expect(result.code).toBe(400);
    expect(put).not.toHaveBeenCalled();
  });
});
