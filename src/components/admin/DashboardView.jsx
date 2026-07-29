import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { IndianRupee, Package, Users, Star } from 'lucide-react';

const CHART_COLORS = {
    brand: '#2563EB',
    secondary: '#0EA5E9',
    accent: '#06B6D4',
    neutral: '#3B82F6',
};

const STATUS_COLORS = {
    PENDING: '#F59E0B',
    CONFIRMED: '#2563EB',
    IN_TRANSIT: '#06B6D4',
    DELIVERED: '#10B981',
    CANCELLED: '#EF4444',
};

const DashboardView = () => {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/analytics');
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const data = await response.json();
                setAnalytics(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading || !analytics) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }
    
    const pieChartData = Object.entries(analytics.bookingsByStatus).map(([name, value]) => ({ name, value }));

     return (
         <div className="space-y-6">
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card className="shadow-lg">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                          <Package className="h-5 w-5 text-blue-600" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold">{analytics.bookingVolume}</div>
                     </CardContent>
                 </Card>
                 <Card className="shadow-lg">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                         <Users className="h-5 w-5 text-yellow-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold">{analytics.bookingsByStatus.PENDING || 0}</div>
                     </CardContent>
                 </Card>
                 <Card className="shadow-lg">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                         <Star className="h-5 w-5 text-purple-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold">{analytics.bookingsByStatus.IN_TRANSIT || 0}</div>
                     </CardContent>
                 </Card>
                 <Card className="shadow-lg">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                         <IndianRupee className="h-5 w-5 text-green-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold">{analytics.bookingsByStatus.DELIVERED || 0}</div>
                     </CardContent>
                 </Card>
             </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Bookings in the Last 7 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.bookingsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                 <Bar dataKey="count" fill={CHART_COLORS.brand} name="New Bookings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Bookings by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                     fill={CHART_COLORS.brand}
                                     dataKey="value"
                                     nameKey="name"
                                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                 >
                                     {pieChartData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || CHART_COLORS.neutral} />
                                     ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardView;
