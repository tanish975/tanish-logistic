import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

// This API route is protected: only logged-in admins can access it
export default withAdminRoute(async function getUsersRoute(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});