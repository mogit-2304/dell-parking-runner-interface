
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Plus, Minus } from 'lucide-react';

// Types
interface Office {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
}

// Mock data for offices
const mockOffices: Office[] = [
  { id: 'hq', name: 'Dell HQ', capacity: 50, occupancy: 10 },
  { id: 'main', name: 'Dell Main', capacity: 156, occupancy: 20 }
];

const SelectOffice = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch offices data
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        // Retrieve persisted data if available
        const persistedOffices = localStorage.getItem('offices');
        if (persistedOffices) {
          setOffices(JSON.parse(persistedOffices));
        } else {
          setOffices(mockOffices);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Unable to load offices');
        setLoading(false);
      }
    };

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
    if (!selectedOffice) return;
    
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
      // In a real app, fetch latest count before update to handle PSU-06
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
      
      // Update occupancy
      const updatedOffices = offices.map(office => {
        if (office.id === selectedOffice.id) {
          return { ...office, occupancy: office.occupancy + 1 };
        }
        return office;
      });
      
      // Update state
      setOffices(updatedOffices);
      setSelectedOffice({
        ...selectedOffice,
        occupancy: selectedOffice.occupancy + 1
      });
      
      // Persist changes (PSU-07)
      localStorage.setItem('offices', JSON.stringify(updatedOffices));
    } catch (err) {
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle decrement occupancy
  const handleDecrement = async () => {
    if (!selectedOffice) return;
    
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
      // In a real app, fetch latest count before update
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
      
      // Update occupancy
      const updatedOffices = offices.map(office => {
        if (office.id === selectedOffice.id) {
          return { ...office, occupancy: office.occupancy - 1 };
        }
        return office;
      });
      
      // Update state
      setOffices(updatedOffices);
      setSelectedOffice({
        ...selectedOffice,
        occupancy: selectedOffice.occupancy - 1
      });
      
      // Persist changes
      localStorage.setItem('offices', JSON.stringify(updatedOffices));
    } catch (err) {
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Retry loading offices
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOffices(mockOffices);
      setLoading(false);
    }, 500);
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
              <h3 className="font-bold text-xl mb-2">{selectedOffice.name}</h3>
              
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
                  disabled={selectedOffice.occupancy <= 0}
                  onClick={handleDecrement}
                >
                  <Minus className="mr-1" /> Exit
                </Button>
                
                <Button 
                  size="lg"
                  disabled={selectedOffice.occupancy >= selectedOffice.capacity}
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
