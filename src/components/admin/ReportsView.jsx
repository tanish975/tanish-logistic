
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const ReportsView = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/get-bookings');
                if (!response.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const data = await response.json();
                setBookings(data);
                setFilteredBookings(data); // Initially, show all bookings
            } catch (error) {
                console.error("Could not load bookings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleFilter = () => {
        if (!startDate || !endDate) {
            toast.error('Please select both a start and end date.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const filtered = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate >= start && bookingDate <= end;
        });

        setFilteredBookings(filtered);
    };

    const handleExport = () => {
        if (filteredBookings.length === 0) {
            toast.error('No data to export.');
            return;
        }

        const csv = Papa.unparse(filteredBookings);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bookings-report-${startDate}-to-${endDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} id="reports-section">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Reports & Export</h2>
                <p className="text-gray-600">Generate and export booking reports.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input 
                            type="date" 
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input 
                            type="date" 
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleFilter} className="bg-blue-600 text-white hover:bg-blue-700">
                        Filter Report
                    </Button>
                    <Button onClick={handleExport} className="bg-green-600 text-white hover:bg-green-700">
                        Export to CSV
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <p>Loading report data...</p>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Report Summary</h3>
                    <p className="text-gray-600">Showing <span className="font-bold">{filteredBookings.length}</span> bookings from <span className="font-bold">{startDate || '...'}</span> to <span className="font-bold">{endDate || '...'}</span>.</p>
                    {/* You could add more summary stats here, like total revenue if you had pricing data */}
                </div>
            )}
        </motion.section>
    );
}

export default ReportsView;
