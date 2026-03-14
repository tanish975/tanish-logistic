import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

export default async function loginRoute(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Hardcoded admin credentials (for demo - use database in production)
    const ADMIN_EMAIL = 'tanish@admin.com';
    const ADMIN_PASSWORD = 'tanish123';

    try {
        // Simple check without database
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const session = await getIronSession(req, res, sessionOptions);
            
            session.user = {
                id: 1,
                email: ADMIN_EMAIL,
                name: 'Tanish Admin',
                role: 'ADMIN',
            };
            await session.save();

            return res.status(200).json({ 
                user: session.user,
                message: 'Login successful'
            });
        }

        return res.status(401).json({ message: 'Invalid credentials.' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
