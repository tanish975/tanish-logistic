import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoutesView = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPopularRoutes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('Failed to fetch popular routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRoutes();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Popular Routes</CardTitle>
        <Button onClick={fetchPopularRoutes} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Showing the top 10 most frequently booked routes based on pickup and drop-off locations.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Pickup Location</TableHead>
              <TableHead>Drop-off Location</TableHead>
              <TableHead className="text-right">Booking Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center">Loading popular routes...</TableCell>
              </TableRow>
            ) : routes.map((route, index) => (
              <TableRow key={`${route.pickup}-${route.drop}`}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{route.pickup}</TableCell>
                <TableCell>{route.drop}</TableCell>
                <TableCell className="text-right font-bold">{route.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && routes.length === 0 && (
            <p className="text-center text-gray-500 py-8">No booking data available to determine popular routes.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RoutesView;
