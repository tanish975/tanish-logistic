import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

export default async function handler(req, res) {
    const session = await getIronSession(req, res, sessionOptions);

    if (session.user) {
        return res.status(200).json({ 
            isLoggedIn: true, 
            user: session.user 
        });
    }

    return res.status(200).json({ isLoggedIn: false });
}
