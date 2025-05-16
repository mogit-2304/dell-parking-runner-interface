
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus, RefreshCcw } from 'lucide-react';

// Types
interface Office {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  version?: number; // Version for optimistic concurrency control
}

// Mock data for offices
const mockOffices: Office[] = [
  { id: 'hq', name: 'Dell HQ', capacity: 50, occupancy: 10, version: 1 },
  { id: 'main', name: 'Dell Main', capacity: 156, occupancy: 20, version: 1 }
];

// Simulated API functions with concurrency handling
const api = {
  // Simulate getting latest office data
  getOffices: async (): Promise<Office[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    const persistedOffices = localStorage.getItem('offices');
    return persistedOffices ? JSON.parse(persistedOffices) : mockOffices;
  },

  // Simulate updating office with version check (optimistic concurrency control)
  updateOffice: async (officeId: string, newOccupancy: number, version: number | undefined): Promise<Office> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Get current state
    const offices = JSON.parse(localStorage.getItem('offices') || JSON.stringify(mockOffices));
    const office = offices.find((o: Office) => o.id === officeId);
    
    if (!office) {
      throw new Error('Office not found');
    }

    // For CI-03: Simulate occasional DB failure (uncomment for testing)
    // if (Math.random() < 0.2) {
    //   throw new Error('Database error');
    // }

    // For CI-01/CI-02: Version check for concurrency control
    if (version !== undefined && office.version !== version) {
      // Return a specific error for concurrency conflicts
      const error = new Error('Conflict: Office data was updated by another user');
      error.name = 'ConcurrencyError';
      throw error;
    }

    // Update and save
    office.occupancy = newOccupancy;
    office.version = (office.version || 0) + 1;
    
    localStorage.setItem('offices', JSON.stringify(offices));
    return office;
  }
};

const SelectOffice = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch offices data
  const fetchOffices = async () => {
    try {
      setLoading(true);
      const latestOffices = await api.getOffices();
      setOffices(latestOffices);
      
      // Update selected office if it exists
      if (selectedOffice) {
        const updatedSelectedOffice = latestOffices.find(o => o.id === selectedOffice.id);
        if (updatedSelectedOffice) {
          setSelectedOffice(updatedSelectedOffice);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Unable to load offices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  // Handle office selection
  const handleSelectOffice = (officeId: string) => {
    const office = offices.find(o => o.id === officeId);
    if (office) {
      setSelectedOffice(office);
    }
  };

  // Handle increment occupancy
  const handleIncrement = async () => {
    if (!selectedOffice || isUpdating) return;
    
    // Check if at capacity
    if (selectedOffice.occupancy >= selectedOffice.capacity) {
      toast({
        title: "Parking full",
        description: `${selectedOffice.name} parking is at capacity.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Get latest office data before update to handle PSU-06
      await fetchOffices();
      
      // Re-check capacity after refresh
      const refreshedOffice = offices.find(o => o.id === selectedOffice.id);
      if (!refreshedOffice || refreshedOffice.occupancy >= refreshedOffice.capacity) {
        toast({
          title: "Parking full",
          description: `${selectedOffice.name} parking is at capacity.`,
          variant: "destructive",
        });
        setIsUpdating(false);
        return;
      }
      
      // Attempt the update with version for optimistic concurrency
      const newOccupancy = refreshedOffice.occupancy + 1;
      const updatedOffice = await api.updateOffice(
        selectedOffice.id, 
        newOccupancy, 
        refreshedOffice.version
      );
      
      // Update state with the new office data
      setOffices(offices.map(office => 
        office.id === selectedOffice.id ? updatedOffice : office
      ));
      
      setSelectedOffice(updatedOffice);
      
    } catch (err: any) {
      if (err.name === 'ConcurrencyError') {
        // Handle CI-01: Concurrent update detected
        toast({
          title: "Update conflict",
          description: "Someone else updated the count. Refreshing data.",
          variant: "destructive",
        });
        // Refresh to get the latest state
        fetchOffices();
      } else {
        // Handle CI-03: Database failure
        toast({
          title: "Unable to update—try again",
          description: "Failed to update parking occupancy.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle decrement occupancy
  const handleDecrement = async () => {
    if (!selectedOffice || isUpdating) return;
    
    // Check if at zero
    if (selectedOffice.occupancy <= 0) {
      toast({
        title: "No vehicles to exit",
        description: `${selectedOffice.name} parking is already empty.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      // Get latest data before update
      await fetchOffices();
      
      // Re-check occupancy after refresh
      const refreshedOffice = offices.find(o => o.id === selectedOffice.id);
      if (!refreshedOffice || refreshedOffice.occupancy <= 0) {
        toast({
          title: "No vehicles to exit",
          description: `${selectedOffice.name} parking is already empty.`,
          variant: "destructive",
        });
        setIsUpdating(false);
        return;
      }
      
      // Attempt the update with version for optimistic concurrency
      const newOccupancy = refreshedOffice.occupancy - 1;
      const updatedOffice = await api.updateOffice(
        selectedOffice.id, 
        newOccupancy, 
        refreshedOffice.version
      );
      
      // Update local state
      setOffices(offices.map(office => 
        office.id === selectedOffice.id ? updatedOffice : office
      ));
      
      setSelectedOffice(updatedOffice);
      
    } catch (err: any) {
      if (err.name === 'ConcurrencyError') {
        // Handle CI-02: Concurrent update detected
        toast({
          title: "Update conflict",
          description: "Someone else updated the count. Refreshing data.",
          variant: "destructive",
        });
        // Refresh to get the latest state
        fetchOffices();
      } else {
        // Handle CI-03: Database failure
        toast({
          title: "Unable to update—try again",
          description: "Failed to update parking occupancy.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Retry loading offices
  const handleRetry = () => {
    setError(null);
    fetchOffices();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Loading offices...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Unable to load offices</AlertTitle>
              <AlertDescription>
                There was a problem loading the office data.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={handleRetry}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Select Office</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="font-medium text-sm mb-2 block">Office Location</label>
            <Select onValueChange={handleSelectOffice} defaultValue={selectedOffice?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Select an office" />
              </SelectTrigger>
              <SelectContent>
                {offices.map(office => (
                  <SelectItem key={office.id} value={office.id}>
                    {office.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedOffice && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">{selectedOffice.name}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={fetchOffices} 
                  disabled={isUpdating}
                >
                  <RefreshCcw className={isUpdating ? "animate-spin" : ""} />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-3 rounded">
                  <div className="text-sm text-gray-500">Occupancy</div>
                  <div className="text-2xl font-bold">{selectedOffice.occupancy}/{selectedOffice.capacity}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <div className="text-sm text-gray-500">Available</div>
                  <div className="text-2xl font-bold">{selectedOffice.capacity - selectedOffice.occupancy}</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-6">
                <Button 
                  size="lg"
                  variant="outline"
                  disabled={selectedOffice.occupancy <= 0 || isUpdating}
                  onClick={handleDecrement}
                >
                  <Minus className="mr-1" /> Exit
                </Button>
                
                <Button 
                  size="lg"
                  disabled={selectedOffice.occupancy >= selectedOffice.capacity || isUpdating}
                  onClick={handleIncrement}
                >
                  <Plus className="mr-1" /> Enter
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectOffice;
