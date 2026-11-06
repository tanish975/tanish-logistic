import { withAdminRoute } from '@/lib/session';
import { readSiteSettings, saveSiteSettings } from '@/lib/site-settings';

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };

export default withAdminRoute(async function settingsGeneralRoute(req, res) {
  try {
    if (req.method === 'GET') return res.status(200).json(await readSiteSettings());
    if (req.method === 'POST') {
      if (!(await saveSiteSettings(req.body))) {
        return res.status(400).json({ message: 'Invalid settings. Secrets cannot be saved here.' });
      }
      return res.status(200).json({ message: 'Settings saved successfully.' });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end('Method Not Allowed');
  } catch {
    return res.status(503).json({ message: 'Settings are temporarily unavailable.' });
  }
});
