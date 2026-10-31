import { publicSiteSettings, readSiteSettings } from '@/lib/site-settings';

// Public branding only. Administrative defaults and credentials are never
// sent to public visitors.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    return res.status(200).json(publicSiteSettings(await readSiteSettings()));
  } catch {
    return res.status(503).json({ message: 'Settings are temporarily unavailable.' });
  }
}
