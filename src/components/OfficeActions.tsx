
import React, { useEffect } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { toast } from '@/hooks/use-toast';
import { ActivityFeed } from './ActivityFeed';
import SliderCTA from './SliderCTA';

interface OfficeActionsProps {
  office: {
    id: string;
    name: string;
    capacity: number;
    occupancy: number;
  };
  onUpdate: (newOccupancy: number) => void;
}

const OfficeActions = ({ office, onUpdate }: OfficeActionsProps) => {
  const { recordActivity } = useActivityFeed();

  // Debug on initial render and when office changes
  useEffect(() => {
    console.log('OfficeActions rendered with office:', office);
  }, [office]);

  // Handle increment occupancy (check-in)
  const handleIncrement = async () => {
    console.log('handleIncrement called - Starting with occupancy:', office.occupancy);
    
    // Check if at capacity
    if (office.occupancy >= office.capacity) {
      toast({
        title: "Parking full",
        description: `${office.name} parking is at capacity.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Update occupancy
      const newOccupancy = office.occupancy + 1;
      
      console.log('handleIncrement - Current:', office.occupancy, 'New:', newOccupancy);
      
      // Record the activity
      recordActivity('check-in', office.name);
      
      // Call the onUpdate callback with the new occupancy - this is crucial for updating the UI
      console.log('About to call onUpdate with newOccupancy:', newOccupancy);
      onUpdate(newOccupancy);
      
      // Display toast confirmation
      toast({
        title: "Vehicle Entered",
        description: `${office.name} occupancy: ${newOccupancy}/${office.capacity}`,
      });
      
    } catch (err) {
      console.error('Error in handleIncrement:', err);
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle decrement occupancy (check-out)
  const handleDecrement = async () => {
    console.log('handleDecrement called - Starting with occupancy:', office.occupancy);
    
    // Check if at zero
    if (office.occupancy <= 0) {
      toast({
        title: "No vehicles to exit",
        description: `${office.name} parking is already empty.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Update occupancy
      const newOccupancy = office.occupancy - 1;
      
      console.log('handleDecrement - Current:', office.occupancy, 'New:', newOccupancy);
      
      // Record the activity
      recordActivity('check-out', office.name);
      
      // Call the onUpdate callback with the new occupancy - this is crucial for updating the UI
      console.log('About to call onUpdate with newOccupancy:', newOccupancy);
      onUpdate(newOccupancy);
      
      // Display toast confirmation
      toast({
        title: "Vehicle Exited",
        description: `${office.name} occupancy: ${newOccupancy}/${office.capacity}`,
      });
      
    } catch (err) {
      console.error('Error in handleDecrement:', err);
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col space-y-4 mb-4 items-center">
        <div className="w-full">
          <SliderCTA
            onComplete={() => {
              console.log('SliderCTA Enter onComplete triggered');
              handleIncrement();
            }}
            slideText="Slide to Enter →"
            releaseText="Release to Enter"
            successText="Vehicle Entered"
            disabled={office.occupancy >= office.capacity}
          />
        </div>
        
        <div className="w-full">
          <SliderCTA
            onComplete={() => {
              console.log('SliderCTA Exit onComplete triggered');
              handleDecrement();
            }}
            slideText="← Slide to Exit"
            releaseText="Release to Exit"
            successText="Vehicle Exited"
            disabled={office.occupancy <= 0}
            direction="rtl"
          />
        </div>
      </div>
      
      <div className="mt-2">
        <ActivityFeed />
      </div>
    </div>
  );
};

export default OfficeActions;
