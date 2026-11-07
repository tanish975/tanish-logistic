import { getValidatedSession } from '@/lib/session';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  try {
    const { user } = await getValidatedSession(req, res);
    return res.status(user ? 200 : 201).json({ isLoading: false, user });
  } catch {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
