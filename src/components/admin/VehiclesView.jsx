import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, RefreshCw, Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const VehiclesView = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({ make: '', model: '', licensePlate: '', type: '', capacity: '' });

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : '/api/vehicles';
    const method = editingVehicle ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, capacity: parseFloat(formData.capacity) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save vehicle');
      }

      toast.success(`Vehicle successfully ${editingVehicle ? 'updated' : 'created'}.`);
      setIsDialogOpen(false);
      fetchVehicles(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setFormData({ make: '', model: '', licensePlate: '', type: '', capacity: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({ 
        make: vehicle.make, 
        model: vehicle.model, 
        licensePlate: vehicle.licensePlate, 
        type: vehicle.type, 
        capacity: String(vehicle.capacity) 
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete vehicle');
      }
      toast.success('Vehicle deleted successfully.');
      fetchVehicles(); // Refresh the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Vehicles</CardTitle>
        <div className="flex gap-2">
            <Button onClick={fetchVehicles} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
            <Button onClick={handleAddNew} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Vehicle
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>License Plate</TableHead>
              <TableHead>Make & Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity (Tons)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center">Loading vehicles...</TableCell>
              </TableRow>
            ) : vehicles.map(vehicle => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell className="flex gap-2">
                  <Button onClick={() => handleEdit(vehicle)} variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDelete(vehicle.id)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!isLoading && vehicles.length === 0 && (
            <p className="text-center text-gray-500 py-8">No vehicles found.</p>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            <DialogDescription>
              {editingVehicle ? 'Update the details for this vehicle.' : 'Enter the details for the new vehicle.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
                    <Input id="make" name="make" value={formData.make} onChange={handleFormChange} required />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                    <Input id="model" name="model" value={formData.model} onChange={handleFormChange} required />
                </div>
            </div>
            <div>
              <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">License Plate</label>
              <Input id="licensePlate" name="licensePlate" value={formData.licensePlate} onChange={handleFormChange} required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type (e.g., Truck, Van)</label>
                    <Input id="type" name="type" value={formData.type} onChange={handleFormChange} required />
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity (in tons)</label>
                    <Input id="capacity" name="capacity" type="number" step="0.1" value={formData.capacity} onChange={handleFormChange} required />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VehiclesView;
