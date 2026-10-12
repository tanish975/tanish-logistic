import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const session = await getIronSession(req, res, sessionOptions);

    // Return the shape admin.jsx and Header.jsx actually check:
    //   data.isLoading && data.user?.role === 'ADMIN'
    if (session.user) {
      return res.status(200).json({ isLoading: false, user: session.user });
    }

    return res.status(201).json({ isLoading: false, user: null });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}