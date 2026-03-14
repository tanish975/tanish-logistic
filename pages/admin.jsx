import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  Users,
  LineChart,
  Settings,
  UserCircle,
  Truck,
  Map,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import LoginForm from '@/components/ui/LoginForm';
import CustomersView from '@/components/admin/CustomersView';
import ReportsView from '@/components/admin/ReportsView';
import AdminControlsView from '@/components/admin/AdminControlsView';
import DashboardView from '@/components/admin/DashboardView';
import ReviewsView from '@/components/admin/ReviewsView';
import DriversView from '@/components/admin/DriversView';
import VehiclesView from '@/components/admin/VehiclesView';
import RoutesView from '@/components/admin/RoutesView';
import SettingsPage from './settings';

const AccessDenied = ({ onLogout }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p className="text-gray-700 mb-6">You do not have permissions to view this page.</p>
      <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
    </div>
  </div>
);

const VALID_BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

// Sample bookings data (without database)
const sampleBookings = [
  { id: 1, bookingId: 'BK001', clientName: 'ABC Corporation', pickup: 'Mumbai', drop: 'Delhi', date: '2025-03-10', status: 'DELIVERED', price: 25000 },
  { id: 2, bookingId: 'BK002', clientName: 'XYZ Industries', pickup: 'Bangalore', drop: 'Chennai', date: '2025-03-12', status: 'IN_TRANSIT', price: 18000 },
  { id: 3, bookingId: 'BK003', clientName: 'PQR Logistics', pickup: 'Ahmedabad', drop: 'Surat', date: '2025-03-14', status: 'PENDING', price: 8000 },
  { id: 4, bookingId: 'BK004', clientName: 'Global Trade Co', pickup: 'Hyderabad', drop: 'Pune', date: '2025-03-15', status: 'CONFIRMED', price: 22000 },
  { id: 5, bookingId: 'BK005', clientName: 'Sunrise Exports', pickup: 'Vadodara', drop: 'Mumbai', date: '2025-03-16', status: 'PENDING', price: 15000 },
];

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data.isLoggedIn && data.user?.role === 'ADMIN') {
          setUser(data.user);
          loadBookings();
          loadReviews();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed', error);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  useEffect(() => {
    let filtered = bookings;
    if (searchInput) {
      filtered = filtered.filter(b => 
        b.clientName.toLowerCase().includes(searchInput.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    setFilteredBookings(filtered);
  }, [bookings, searchInput, statusFilter]);

  const loadBookings = async () => {
    setBookings(sampleBookings);
    toast.success('Bookings loaded successfully');
  };

  const loadReviews = async () => {
    try {
      const response = await fetch('/data/reviews.json');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Could not load reviews:", error);
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') {
      loadBookings();
      loadReviews();
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      toast.info('You have been logged out.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.bookingId === bookingId ? { ...b, status: newStatus } : b
      )
    );
    toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'IN_TRANSIT': return 'secondary';
      case 'CANCELLED': return 'destructive';
      case 'CONFIRMED': return 'default';
      case 'PENDING':
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (user.role !== 'ADMIN') {
    return <AccessDenied onLogout={handleLogout} />;
  }

  const renderContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {(() => {
          switch (currentSection) {
            case 'dashboard':
              return <DashboardView bookings={bookings} />;
            case 'bookings':
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input placeholder="Search by client or booking ID..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="max-w-sm" />
                    <Select onValueChange={setStatusFilter} defaultValue="all">
                      <SelectTrigger className="w-[180px] bg-background border-input">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {VALID_BOOKING_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={loadBookings}>Refresh</Button>
                  </div>
                  <Card className="shadow-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map(booking => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.bookingId}</TableCell>
                            <TableCell>{booking.clientName}</TableCell>
                            <TableCell>{booking.pickup} → {booking.drop}</TableCell>
                            <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                            <TableCell>₹{booking.price?.toLocaleString()}</TableCell>
                            <TableCell>
                                <Select value={booking.status} onValueChange={(newStatus) => handleUpdateBookingStatus(booking.bookingId, newStatus)}>
                                    <SelectTrigger className="w-[120px] bg-background">
                                        <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VALID_BOOKING_STATUSES.map(status => (
                                            <SelectItem key={status} value={status}>
                                                <Badge variant={getStatusVariant(status)}>{status.replace('_', ' ')}</Badge>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              );
            case 'drivers':
              return <DriversView />;
            case 'vehicles':
              return <VehiclesView />;
            case 'routes':
              return <RoutesView />;
            case 'customers':
              return <CustomersView />;
            case 'reviews':
              return <ReviewsView reviews={reviews} onRefresh={loadReviews} />;
            case 'settings':
              return <SettingsPage />;
            default:
              return null;
          }
        })()}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <Head><title>Tanish Logistic - Admin</title></Head>
      <Toaster richColors />
      <div className="flex min-h-screen w-full flex-col bg-gray-50">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-gray-100 sm:flex">
          <div className="flex flex-col gap-2 p-4 pt-14">
            <h2 className="text-lg font-semibold">Tanish Logistic</h2>
            <nav className="flex flex-col gap-1">
              <Button variant={currentSection === 'dashboard' ? 'default' : 'outline'} onClick={() => setCurrentSection('dashboard')} className="justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant={currentSection === 'bookings' ? 'default' : 'outline'} onClick={() => setCurrentSection('bookings')} className="justify-start">
                <Package className="mr-2 h-4 w-4" />
                Bookings
              </Button>
               <Button variant={currentSection === 'drivers' ? 'default' : 'outline'} onClick={() => setCurrentSection('drivers')} className="justify-start">
                <UserCircle className="mr-2 h-4 w-4" />
                Drivers
              </Button>
              <Button variant={currentSection === 'vehicles' ? 'default' : 'outline'} onClick={() => setCurrentSection('vehicles')} className="justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Vehicles
              </Button>
              <Button variant={currentSection === 'routes' ? 'default' : 'outline'} onClick={() => setCurrentSection('routes')} className="justify-start">
                <Map className="mr-2 h-4 w-4" />
                Routes
              </Button>
              <Button variant={currentSection === 'customers' ? 'default' : 'outline'} onClick={() => setCurrentSection('customers')} className="justify-start">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button variant={currentSection === 'reviews' ? 'default' : 'outline'} onClick={() => setCurrentSection('reviews')} className="justify-start">
                <LineChart className="mr-2 h-4 w-4" />
                Reviews
              </Button>
              <Button variant={currentSection === 'settings' ? 'default' : 'outline'} onClick={() => setCurrentSection('settings')} className="justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </aside>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="text-xl font-bold">{currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
