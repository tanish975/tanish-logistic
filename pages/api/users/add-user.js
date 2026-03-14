import { withSessionRoute } from '@/lib/session';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');
const saltRounds = 10;

export default withSessionRoute(async function addUserRoute(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required.' });
    }

    let users = [];
    try {
        const fileContent = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty, start with an empty array
        if (error.code === 'ENOENT') {
            users = [];
        } else {
            console.error('Error reading users file:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: Date.now(), // Simple unique ID
            username,
            passwordHash,
            name,
        };

        const updatedUsers = [...users, newUser];

        fs.writeFileSync(usersFilePath, JSON.stringify(updatedUsers, null, 2));

        const { passwordHash: _, ...safeUser } = newUser;
        res.status(201).json({ message: 'User added successfully.', user: safeUser });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});