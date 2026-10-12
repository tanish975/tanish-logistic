import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default withAdminRoute(async function addUserRoute(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid input types.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'CUSTOMER',
            },
        });

        res.status(201).json({
            message: 'User added successfully.',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            }
        });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});