import { withSessionRoute } from '@/lib/session';
import fs from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

// This API route is protected, only logged-in admins can access it
export default withSessionRoute(function getUsersRoute(req, res) {
    // Check if the user is authenticated
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let users = [];
    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty, return an empty array
        if (error.code === 'ENOENT') {
            users = [];
        } else {
            console.error('Error reading users file:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    try {
        // Return all users but omit the password hashes for security
        const safeUsers = users.map(({ passwordHash, ...user }) => user);
        res.status(200).json(safeUsers);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});