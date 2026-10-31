import { withAdminRoute } from '@/lib/session';
import { IncomingForm } from 'formidable';
import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { normalizeLogo } from '@/lib/image-upload';
import { isVercelRequest } from '@/lib/bot-protection';

export const config = { api: { bodyParser: false } };
const MAX_FILE_SIZE = 3 * 1024 * 1024;

export default withAdminRoute(async function uploadRoute(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if ((isVercelRequest() || process.env.NODE_ENV === 'production') && !blobToken) {
    return res.status(503).json({ error: 'Logo storage is not configured. Contact the site administrator.' });
  }

  let tempDir;
  try {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tanish-logo-'));
    const form = new IncomingForm({
      uploadDir: tempDir,
      maxFiles: 1,
      maxFileSize: MAX_FILE_SIZE,
      maxTotalFileSize: MAX_FILE_SIZE,
      maxFields: 0,
      allowEmptyFiles: false,
    });
    const [, files] = await form.parse(req);
    const incoming = files.file;
    const file = Array.isArray(incoming) ? incoming[0] : incoming;
    if (!file || Object.keys(files).length !== 1 || (Array.isArray(incoming) && incoming.length !== 1)) {
      return res.status(400).json({ error: 'Select exactly one logo image.' });
    }
    const extension = path.extname(file.originalFilename || '').toLowerCase();
    const normalized = await normalizeLogo(await fs.readFile(file.filepath), extension);
    if (!normalized) {
      return res.status(400).json({ error: 'Upload a valid PNG, JPEG, GIF or WebP image (maximum 3 MB). SVG and PDF are not allowed.' });
    }
    const filename = `${randomUUID()}.png`;
    let url;
    if (blobToken) {
      // Public Blob storage is appropriate only for non-sensitive website logos.
      const blob = await put(`logos/${filename}`, normalized, {
        access: 'public', token: blobToken, contentType: 'image/png', addRandomSuffix: false,
      });
      url = blob.url;
    } else {
      // Local/self-hosted development only. Vercel never writes to public/.
      const directory = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(directory, { recursive: true });
      await fs.writeFile(path.join(directory, filename), normalized, { flag: 'wx', mode: 0o644 });
      url = `/uploads/${filename}`;
    }
    return res.status(200).json({ url });
  } catch (error) {
    if (error?.httpCode === 413) return res.status(413).json({ error: 'File too large. Maximum size is 3 MB.' });
    // Malformed multipart bodies are input errors; storage/network failures
    // are generic and never include provider credentials or internal paths.
    if (error?.httpCode && error.httpCode < 500) return res.status(400).json({ error: 'Invalid file upload.' });
    return res.status(503).json({ error: 'Logo upload is temporarily unavailable.' });
  } finally {
    if (tempDir) await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});
