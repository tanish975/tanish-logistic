import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function deleteUserRoute(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (id === req.session.user.id) {
        return res.status(403).json({ message: 'You cannot delete your own account.' });
    }

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});