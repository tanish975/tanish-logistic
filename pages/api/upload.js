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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const form = new IncomingForm({
    uploadDir: uploadsDir,
    keepExtensions: true,
    filename: (name, ext, part, form) => {
      return `${name}-${Date.now()}${ext}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing the file upload.' });
    }

    const file = files.file; // 'file' is the name of the field in the FormData
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // In formidable v3, files are returned in an array.
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    const fileUrl = `/uploads/${path.basename(uploadedFile.filepath)}`;

    res.status(200).json({ url: fileUrl });
  });
}