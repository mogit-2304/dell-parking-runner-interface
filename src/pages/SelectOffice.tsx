import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/AppHeader';
import OfficeActions from '@/components/OfficeActions';
import LanguageSelector from '@/components/LanguageSelector';

// Types
interface Office {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  version?: number;
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
  // Setting showDebugInfo to false by default and removing the toggle function
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);

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
          const parsedOffices = JSON.parse(persistedOffices);
          setOffices(parsedOffices);
          console.log('Loaded offices from localStorage:', parsedOffices);
          
          // Auto-select the first office if we have offices and none is selected
          if (parsedOffices.length > 0) {
            setSelectedOffice(parsedOffices[0]);
            console.log('Auto-selected first office:', parsedOffices[0]);
          }
        } else {
          setOffices(mockOffices);
          console.log('Using mock offices data:', mockOffices);
          
          // Auto-select the first office from mock data
          if (mockOffices.length > 0) {
            setSelectedOffice(mockOffices[0]);
            console.log('Auto-selected first office from mock data:', mockOffices[0]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching offices:', err);
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
      console.log('Selected office:', office);
    }
  };

  // Handle occupancy update - using useCallback to maintain stable reference
  const handleOccupancyUpdate = useCallback((newOccupancy: number) => {
    if (!selectedOffice) {
      console.error('Cannot update occupancy: No office selected');
      return;
    }
    
    console.log('SelectOffice - handleOccupancyUpdate called with newOccupancy:', newOccupancy);
    console.log('Current office state before update:', selectedOffice);
    
    // Create a versioned update to ensure we track changes
    const versionedUpdate = {
      ...selectedOffice,
      occupancy: newOccupancy,
      version: (selectedOffice.version || 0) + 1
    };
    
    console.log('New office state to be applied:', versionedUpdate);
    
    // Update offices state
    setOffices(prevOffices => {
      const updatedOffices = prevOffices.map(office => {
        if (office.id === selectedOffice.id) {
          return versionedUpdate;
        }
        return office;
      });
      
      // Persist changes in localStorage immediately
      localStorage.setItem('offices', JSON.stringify(updatedOffices));
      console.log('Updated offices in localStorage:', updatedOffices);
      
      return updatedOffices;
    });
    
    // Update selected office separately
    setSelectedOffice(versionedUpdate);
    
    // Display toast for debugging
    toast({
      title: "Office Updated",
      description: `${selectedOffice.name} occupancy updated to ${newOccupancy}`,
    });
    
  }, [selectedOffice]);

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

  // Ensure selectedOffice stays in sync with offices array
  useEffect(() => {
    if (selectedOffice) {
      const updatedOffice = offices.find(o => o.id === selectedOffice.id);
      if (updatedOffice && updatedOffice.version !== selectedOffice.version) {
        console.log('Syncing selectedOffice with updated office data:', updatedOffice);
        setSelectedOffice(updatedOffice);
      }
    }
  }, [offices, selectedOffice]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p>Loading offices...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4">
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
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AppHeader />
      <div className="flex-1 p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardContent className="space-y-6 pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-sm block">Office Location</label>
                <LanguageSelector />
              </div>
              <Select onValueChange={handleSelectOffice} value={selectedOffice?.id || ""}>
                <SelectTrigger className="w-full">
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
            
            {selectedOffice ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{selectedOffice.name} Parking Status</h3>
                    {/* Removed the Show Debug button */}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Current Parking Occupancy</div>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{selectedOffice.occupancy}/{selectedOffice.capacity}</div>
                        <div className="text-sm text-gray-500">
                          {selectedOffice.occupancy === selectedOffice.capacity 
                            ? "Parking is full" 
                            : `${Math.round((selectedOffice.occupancy / selectedOffice.capacity) * 100)}% occupied`
                          }
                        </div>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            selectedOffice.occupancy / selectedOffice.capacity > 0.8 
                              ? 'bg-red-500' 
                              : selectedOffice.occupancy / selectedOffice.capacity > 0.5 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (selectedOffice.occupancy / selectedOffice.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-sm text-gray-500 mb-1">Available Parking Slots</div>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold text-green-600">{selectedOffice.capacity - selectedOffice.occupancy}</div>
                        <div className="text-sm text-green-600">
                          {selectedOffice.capacity - selectedOffice.occupancy === 0
                            ? "No spaces available"
                            : `${Math.round(((selectedOffice.capacity - selectedOffice.occupancy) / selectedOffice.capacity) * 100)}% available`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-4">Vehicle Entry/Exit</h4>
                    <OfficeActions 
                      office={selectedOffice} 
                      onUpdate={handleOccupancyUpdate}
                      showDebugInfo={showDebugInfo}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border">
                <p className="text-gray-500">Please select an office to manage parking</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectOffice;
