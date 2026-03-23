import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const session = await getIronSession(req, res, sessionOptions);
    
    if (session.user) {
      return res.status(200).json(session.user);
    }
    
    return res.status(401).json({ message: 'Not authenticated' });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
