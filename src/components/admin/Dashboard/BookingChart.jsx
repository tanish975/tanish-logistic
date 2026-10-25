import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BookingChart = ({ bookings }) => {
  const data = MONTHS.map((name, index) => ({
    name,
    total: Array.isArray(bookings)
      ? bookings.filter((booking) => {
        const date = new Date(booking.createdAt || booking.date || booking.pickupDate);
        return !Number.isNaN(date.valueOf()) && date.getMonth() === index;
      }).length
      : 0,
  }));

  const CHART_COLORS = {
    brand: '#2563EB',
    secondary: '#0EA5E9',
    accent: '#06B6D4',
    neutral: '#3B82F6',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke={CHART_COLORS.neutral}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={CHART_COLORS.neutral}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Bar dataKey="total" fill={CHART_COLORS.brand} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BookingChart;
