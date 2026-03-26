import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function loginRoute(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email },
        });
        
        if (user) {
            // Check password
            const isValid = await bcrypt.compare(password, user.password);
            
            if (isValid) {
                const session = await getIronSession(req, res, sessionOptions);
                
                session.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
                await session.save();

                return res.status(200).json({ 
                    user: session.user,
                    message: 'Login successful'
                });
            }
        }

        // Also check hardcoded admin credentials as fallback
        const ADMIN_EMAIL = 'tksunaria@gmail.com';
        const ADMIN_PASSWORD = 'Tanishlogistic09';

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
        // Check if it's a database connection error
        if (error.message && error.message.includes('connection')) {
            res.status(503).json({ message: 'Database connection error. Please try again later.' });
        } else {
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
}
