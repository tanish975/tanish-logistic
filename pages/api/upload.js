import { withAdminRoute } from '@/lib/session';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ponytail: allowlist of safe extensions; reject everything else.
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.pdf']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default withAdminRoute(async function uploadRoute(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const form = new IncomingForm({
    uploadDir: uploadsDir,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    filename: (name, ext, part, form) => {
      // Sanitize: strip any path separators from the incoming filename.
      const safeBase = String(name).replace(/[\\/]/g, '-').replace(/\s+/g, '-').slice(0, 60) || 'upload';
      const safeExt = (ext && ALLOWED_EXTENSIONS.has(ext.toLowerCase())) ? ext.toLowerCase() : '';
      return `${safeBase}-${Date.now()}${safeExt}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      // formidable returns its own error for oversized files.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 5 MB.' });
      }
      return res.status(500).json({ error: 'Error parsing the file upload.' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;
    const ext = path.extname(uploadedFile.originalFilename || '').toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      // Remove the temp file formidable already wrote.
      try { fs.unlinkSync(uploadedFile.filepath); } catch {}
      return res.status(400).json({ error: `File type "${ext || 'unknown'}" is not allowed.` });
    }

    const fileUrl = `/uploads/${path.basename(uploadedFile.filepath)}`;
    res.status(200).json({ url: fileUrl });
  });
});