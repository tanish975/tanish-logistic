'use client';

import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RefreshCw, Trash2, Filter, Clock, CheckCircle2, XCircle, Package, Truck } from 'lucide-react';

const VALID_BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

const STATUS_VARIANTS = {
  PENDING: 'outline',
  CONFIRMED: 'default',
  IN_TRANSIT: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function BookingsSection({
  bookings,
  allBookings,
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  loadBookings,
  handleUpdateBookingStatus,
  handleDeleteBooking,
  handleDeleteAllCancelled,
  shouldReduceMotion,
}) {
  const shouldReduceMotionLocal = useReducedMotion();
  const [isEditing, setIsEditing] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    inTransit: bookings.filter(b => b.status === 'IN_TRANSIT').length,
    delivered: bookings.filter(b => b.status === 'DELIVERED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }, [bookings]);

  const statusBadgeVariants = {
    PENDING: 'outline',
    CONFIRMED: 'default',
    IN_TRANSIT: 'secondary',
    DELIVERED: 'success',
    CANCELLED: 'destructive',
  };

  const statusLabels = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };

  const statusColors = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-cyan-100 text-cyan-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  const bookingsToRender = bookings.length > 0 ? bookings : null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<Package className="h-5 w-5 text-sky-600" />}
          color="bg-sky-500"
        />
        <StatCard
          title="Pending"
          value={bookings.filter(b => b.status === 'PENDING').length}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          color="bg-amber-500"
        />
        <StatCard
          title="Confirmed"
          value={bookings.filter(b => b.status === 'CONFIRMED').length}
          icon={<CheckCircle className="h-5 w-5 text-blue-600" />}
          color="bg-blue-500"
        />
        <StatCard
          title="In Transit"
          value={bookings.filter(b => b.status === 'IN_TRANSIT').length}
          icon={<Truck className="h-5 w-5 text-cyan-600" />}
          color="bg-cyan-500"
        />
        <StatCard
          title="Delivered"
          value={bookings.filter(b => b.status === 'DELIVERED').length}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          color="bg-green-500"
        />
        <StatCard
          title="Cancelled"
          value={bookings.filter(b => b.status === 'CANCELLED').length}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          color="bg-red-500"
        />
      </motion.div>

      {/* Filters & Actions */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
                <Input
                  placeholder="Search by client, booking ID, route..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 pr-4 py-2.5"
                  placeholder="Search bookings..."
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-48">
                <SelectTrigger className="bg-background border-slate-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {VALID_BOOKING_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(status)} className="w-20 justify-center">
                          {STATUS_LABELS[status]}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={loadBookings}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={handleDeleteAllCancelled}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete All Cancelled
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Package className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No bookings found</h3>
              <p className="mt-1 text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 border-b border-slate-200">
                  <TableRow>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Booking ID</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</TableHead>
                    <TableHead className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : index * 0.03 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <TableCell className="px-4 py-4 font-mono text-sm font-medium text-slate-900">
                        {booking.bookingId || booking.id}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{booking.clientName || booking.customerName || 'N/A'}</p>
                          {booking.clientPhone && <p className="text-xs text-slate-500">{booking.clientPhone}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{booking.pickup} → {booking.drop}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-sm text-slate-600">
                        {booking.date ? new Date(booking.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant={getStatusVariant(booking.status)}>
                          {STATUS_LABELS[booking.status] || booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={booking.status}
                            onValueChange={(newStatus) => handleUpdateBookingStatus(booking.id, newStatus)}
                            className="w-[140px]"
                          >
                            <SelectTrigger className="bg-background border-slate-200 h-8 text-sm">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              {VALID_BOOKING_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center gap-2 w-full">
                                    <Badge variant={getStatusVariant(status)} className="w-24 justify-center">
                                      {STATUS_LABELS[status]}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteBooking(booking.id)}
                            aria-label={`Delete booking ${booking.bookingId || booking.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="mt-1 text-3xl font-bold text-slate-950 tabular-nums">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}/10`}>
            <div style={{ color: color.replace('bg-', '').replace('500', '600') }} className="h-6 w-6">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status) {
  const variants = {
    PENDING: 'outline',
    CONFIRMED: 'default',
    IN_TRANSIT: 'secondary',
    DELIVERED: 'success',
    CANCELLED: 'destructive',
  };
  return variants[status] || 'outline';
}