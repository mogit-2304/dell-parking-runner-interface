
import React, { useEffect, useState } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { toast } from '@/hooks/use-toast';
import { ActivityFeed } from './ActivityFeed';
import SliderCTA from './SliderCTA';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface OfficeActionsProps {
  office: {
    id: string;
    name: string;
    capacity: number;
    occupancy: number;
  };
  onUpdate: (newOccupancy: number) => void;
  showDebugInfo?: boolean; // Keeping prop but will set a default value
}

const OfficeActions = ({ office, onUpdate, showDebugInfo = false }: OfficeActionsProps) => {
  const { recordActivity } = useActivityFeed();
  const [entryCount, setEntryCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);

  // Debug on initial render and when office changes
  useEffect(() => {
    console.log('OfficeActions rendered with office:', office);
  }, [office]);

  // Reset counters when office changes
  useEffect(() => {
    setEntryCount(office.occupancy);
    setExitCount(office.capacity - office.occupancy);
  }, [office.id, office.occupancy, office.capacity]);

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
      
      // Update the entry counter
      setEntryCount(prevCount => prevCount + 1);
      
      // Call the onUpdate callback with the new occupancy - this is crucial for updating the UI
      console.log('About to call onUpdate with newOccupancy:', newOccupancy);
      onUpdate(newOccupancy);
      
      // Display toast confirmation - simplified to only show "Vehicle Entered"
      toast({
        title: "Vehicle Entered",
        description: "",
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
      
      // Update the exit counter
      setExitCount(prevCount => prevCount + 1);
      
      // Call the onUpdate callback with the new occupancy - this is crucial for updating the UI
      console.log('About to call onUpdate with newOccupancy:', newOccupancy);
      onUpdate(newOccupancy);
      
      // Display toast confirmation - simplified to only show "Vehicle Exited"
      toast({
        title: "Vehicle Exited",
        description: "",
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <SliderCTA
            onComplete={() => {
              console.log('SliderCTA Enter onComplete triggered');
              handleIncrement();
            }}
            slideText="Slide to Enter →"
            releaseText="Release to Enter"
            successText="Vehicle Entered"
            disabled={office.occupancy >= office.capacity}
            showDebugInfo={showDebugInfo}
            counter={entryCount} // Pass the entry counter
          />
        </div>
        
        <div>
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
            showDebugInfo={showDebugInfo}
            counter={exitCount} // Pass the exit counter
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 text-sm font-medium"
              >
                <span>Recent Activity</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="center">
              <DropdownMenuLabel className="font-semibold">
                Recent Activity
              </DropdownMenuLabel>
              <div className="max-h-[300px] overflow-hidden bg-white">
                <ActivityFeed />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default OfficeActions;
