import { withSessionRoute } from '@/lib/session';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

export default withSessionRoute(function deleteUserRoute(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }
    
    // Prevent admin from deleting themselves
    if (id === req.session.user.id) {
        return res.status(403).json({ message: 'You cannot delete your own account.' });
    }

    let users = [];
    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading users file:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    const initialLength = users.length;
    const updatedUsers = users.filter(u => u.id !== id);

    if (updatedUsers.length === initialLength) {
        return res.status(404).json({ message: 'User not found.' });
    }

    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});