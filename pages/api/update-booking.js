import fs from 'fs';
import path from 'path';

const bookingsFilePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: 'Booking ID and status are required.' });
    }

    try {
        const fileContents = fs.readFileSync(bookingsFilePath, 'utf8');
        let bookings = JSON.parse(fileContents || '[]');

        const bookingIndex = bookings.findIndex(b => b.id === id);

        if (bookingIndex === -1) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        bookings[bookingIndex].status = status;
        // Optional: Add an updatedAt timestamp
        bookings[bookingIndex].updatedAt = new Date().toISOString();


        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));

        res.status(200).json({ message: 'Booking updated successfully.', booking: bookings[bookingIndex] });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}