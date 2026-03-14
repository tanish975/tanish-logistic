
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AdminControlsView = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users/get-users');
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/users/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add user');
            }

            setSuccess(data.message);
            setName('');
            setUsername('');
            setPassword('');
            fetchUsers(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/users/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete user');
            }

            setSuccess(data.message);
            fetchUsers(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} id="admin-controls-section">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Controls</h2>
                <p className="text-gray-600">Manage admin accounts for the dashboard.</p>
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
            {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New User Form */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Admin</h3>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Add Admin</button>
                    </form>
                </div>

                {/* Existing Users List */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Current Admins</h3>
                    {isLoading ? <p>Loading...</p> : (
                        <ul className="space-y-3">
                            {users.map(user => (
                                <li key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </motion.section>
    );
}

export default AdminControlsView;
