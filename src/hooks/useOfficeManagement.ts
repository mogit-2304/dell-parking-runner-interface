
import { useState, useCallback } from 'react';
import { Office } from '@/types/office';
import { officeService } from '@/services/officeService';
import { toast } from '@/hooks/use-toast';
import { activityService } from '@/services/activityService';

export const useOfficeManagement = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch offices data
  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      const latestOffices = await officeService.getOffices();
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
  }, [selectedOffice]);

  // Record activity
  const recordActivity = useCallback(async (type: 'check-in' | 'check-out', officeName: string) => {
    try {
      await activityService.addActivity({
        type,
        officeName
      });
    } catch (err) {
      console.error('Failed to record activity:', err);
    }
  }, []);

  // Handle office selection
  const handleSelectOffice = useCallback((officeId: string) => {
    const office = offices.find(o => o.id === officeId);
    if (office) {
      setSelectedOffice(office);
    }
  }, [offices]);

  // Handle increment occupancy
  const handleIncrement = useCallback(async () => {
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
      
      // Get latest office data before update
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
      const updatedOffice = await officeService.updateOffice(
        selectedOffice.id, 
        newOccupancy, 
        refreshedOffice.version
      );
      
      // Update state with the new office data
      setOffices(offices.map(office => 
        office.id === selectedOffice.id ? updatedOffice : office
      ));
      
      setSelectedOffice(updatedOffice);
      
      // Record check-in activity
      await recordActivity('check-in', updatedOffice.name);
      
    } catch (err: any) {
      if (err.name === 'ConcurrencyError') {
        // Handle concurrency conflict
        toast({
          title: "Update conflict",
          description: "Someone else updated the count. Refreshing data.",
          variant: "destructive",
        });
        // Refresh to get the latest state
        fetchOffices();
      } else {
        // Handle database failure
        toast({
          title: "Unable to update—try again",
          description: "Failed to update parking occupancy.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }, [selectedOffice, isUpdating, offices, fetchOffices, recordActivity]);

  // Handle decrement occupancy
  const handleDecrement = useCallback(async () => {
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
      const updatedOffice = await officeService.updateOffice(
        selectedOffice.id, 
        newOccupancy, 
        refreshedOffice.version
      );
      
      // Update local state
      setOffices(offices.map(office => 
        office.id === selectedOffice.id ? updatedOffice : office
      ));
      
      setSelectedOffice(updatedOffice);
      
      // Record check-out activity
      await recordActivity('check-out', updatedOffice.name);
      
    } catch (err: any) {
      if (err.name === 'ConcurrencyError') {
        // Handle concurrency conflict
        toast({
          title: "Update conflict",
          description: "Someone else updated the count. Refreshing data.",
          variant: "destructive",
        });
        // Refresh to get the latest state
        fetchOffices();
      } else {
        // Handle database failure
        toast({
          title: "Unable to update—try again",
          description: "Failed to update parking occupancy.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }, [selectedOffice, isUpdating, offices, fetchOffices, recordActivity]);

  return {
    offices,
    selectedOffice,
    loading,
    error,
    isUpdating,
    fetchOffices,
    handleSelectOffice,
    handleIncrement,
    handleDecrement
  };
};
