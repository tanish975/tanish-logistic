
import fs from 'fs';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Booking ID is required.' });
    }

    try {
        const fileContents = fs.readFileSync(bookingsFilePath, 'utf8');
        let bookings = JSON.parse(fileContents || '[]');

        const initialLength = bookings.length;
        bookings = bookings.filter(b => b.id !== id);

        if (bookings.length === initialLength) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));

        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
