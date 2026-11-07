import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

const saltRounds = 12;

export default withAdminRoute(async function addUserRoute(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password, name } = req.body || {};
    if (typeof email !== 'string' || email.length > 254 ||
        !/^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/.test(email) ||
        typeof name !== 'string' || !name.trim() || name.length > 120 || /[\u0000-\u001f\u007f]/.test(name) ||
        typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(400).json({ message: 'Enter a valid email and name, and a password of at least 12 characters and at most 72 UTF-8 bytes.' });
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
                name: name.trim(),
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

    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});