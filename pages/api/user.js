import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

export default async function userRoute(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const session = await getIronSession(req, res, sessionOptions);

    if (session.user) {
      return res.status(200).json({ isLoggedIn: true, user: session.user });
    } else {
      return res.status(200).json({ isLoggedIn: false, user: null });
    }
  } catch (error) {
    console.error('User session check error:', error);
    return res.status(500).json({ isLoggedIn: false, user: null });
  }
}
