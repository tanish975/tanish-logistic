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
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // User authenticated - create session
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
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
}
