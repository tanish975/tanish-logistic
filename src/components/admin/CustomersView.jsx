
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomersView = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/get-customers');
                if (!response.ok) {
                    throw new Error('Failed to fetch customers');
                }
                const data = await response.json();
                setCustomers(data);
                setFilteredCustomers(data);
            } catch (error) {
                console.error("Could not load customers:", error);
                // You might want to show a notification here
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const lowercasedInput = searchInput.toLowerCase();
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedInput) ||
            customer.phone.includes(lowercasedInput)
        );
        setFilteredCustomers(filtered);
    }, [searchInput, customers]);

    return (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} id="customers-section">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Directory</h2>
                <p className="text-gray-600">View and search all your clients.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <input 
                    type="text" 
                    placeholder="Search by name or phone..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>

            {isLoading ? (
                <p>Loading customers...</p>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Booking Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer.phone} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.phone}</div>
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{customer.totalBookings}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.lastBookingDate}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-500">No customers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </motion.section>
    );
}

export default CustomersView;
