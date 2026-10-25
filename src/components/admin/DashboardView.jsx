'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import { IndianRupee, Package, Users, Star, ArrowRight, Plus, Map, Settings } from 'lucide-react';

const CHART_COLORS = {
  brand: '#0369A1',
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

const DashboardView = ({ bookings = [], reviews = [] }) => {
  const shouldReduceMotion = useReducedMotion();
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

  // Fallback analytics from bookings/reviews if API fails
  const fallbackAnalytics = useMemo(() => ({
    bookingVolume: bookings?.length || 0,
    bookingsByStatus: {
      PENDING: bookings?.filter(b => b.status === 'PENDING').length || 0,
      CONFIRMED: bookings?.filter(b => b.status === 'CONFIRMED').length || 0,
      IN_TRANSIT: bookings?.filter(b => b.status === 'IN_TRANSIT').length || 0,
      DELIVERED: bookings?.filter(b => b.status === 'DELIVERED').length || 0,
      CANCELLED: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
    },
    bookingsOverTime: [],
  }), [bookings]);

  const displayAnalytics = analytics || fallbackAnalytics;

  const pieChartData = Object.entries(displayAnalytics.bookingsByStatus || {}).map(([name, value]) => ({ name, value }));

  const statCards = [
    { title: 'Total Bookings', value: displayAnalytics.bookingVolume || 0, icon: <Package className="h-5 w-5" />, color: 'bg-sky-500' },
    { title: 'Pending Bookings', value: displayAnalytics.bookingsByStatus?.PENDING || 0, icon: <Users className="h-5 w-5" />, color: 'bg-amber-500' },
    { title: 'In Transit', value: displayAnalytics.bookingsByStatus?.IN_TRANSIT || 0, icon: <Star className="h-5 w-5" />, color: 'bg-cyan-500' },
    { title: 'Delivered', value: displayAnalytics.bookingsByStatus?.DELIVERED || 0, icon: <IndianRupee className="h-5 w-5" />, color: 'bg-green-500' },
  ];

  const renderSkeleton = (delay = 0) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
          >
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="mt-1 text-3xl font-bold text-slate-950 tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}/10`}>
                    <div style={{ color: stat.color.replace('bg-', '').replace('500', '600') }} className="h-6 w-6">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-950">Bookings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayAnalytics.bookingsOverTime || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#0369A1"
                  name="New Bookings"
                  radius={[4, 4, 0, 0]}
                  maxBarWidth={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-950">Bookings by Status</CardTitle>
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
                  fill="#0369A1"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || CHART_COLORS.neutral} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name) => [`${value} bookings`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <QuickActionCard
          title="New Booking"
          description="Create a new booking"
          icon={<Plus className="h-5 w-5" />}
          href="/book"
          color="bg-sky-500"
        />
        <QuickActionCard
          title="View Routes"
          description="Manage routes"
          icon={<Map className="h-5 w-5" />}
          href="/admin?section=routes"
          color="bg-cyan-500"
        />
        <QuickActionCard
          title="Manage Reviews"
          description="Moderate reviews"
          icon={<Star className="h-5 w-5" />}
          href="/admin?section=reviews"
          color="bg-amber-500"
        />
        <QuickActionCard
          title="Settings"
          description="Configure system"
          icon={<Settings className="h-5 w-5" />}
          href="/admin?section=settings"
          color="bg-slate-500"
        />
      </motion.div>
    </motion.div>
  );
};

function QuickActionCard({ title, description, icon, href, color }) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="block p-5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${color}/10`}>
            <div style={{ color: color.replace('bg-', '').replace('500', '600') }} className="h-6 w-6">
              {icon}
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-sm font-medium text-sky-600">Open</span>
          <ArrowRight className="h-4 w-4 text-sky-600" />
        </div>
      </Link>
    </motion.div>
  );
}

export default DashboardView;