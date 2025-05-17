
import React, { useEffect, useState } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { toast } from '@/hooks/use-toast';
import { ActivityFeed } from './ActivityFeed';
import SliderCTA from './SliderCTA';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';
import { ChevronDown } from 'lucide-react';

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
  const isMobile = useMobile();

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

  // Render mobile activity UI using Sheet component for mobile
  const renderMobileActivityUI = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 text-sm font-medium w-full justify-center"
        >
          <span>Recent Activity</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-bold">Recent Activity</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ActivityFeed />
        </div>
      </SheetContent>
    </Sheet>
  );

  // Render desktop activity UI using dropdown
  const renderDesktopActivityUI = () => (
    <div className="flex justify-center">
      <div className="relative flex flex-col items-center w-full">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 text-sm font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Recent Activity</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        {isOpen && (
          <div className="absolute top-full mt-1 w-80 bg-white rounded-md shadow-lg z-50 border">
            <div className="p-2 font-semibold border-b">
              Recent Activity
            </div>
            <div className="max-h-[300px] overflow-hidden bg-white">
              <ActivityFeed />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // State for dropdown visibility on desktop
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside (for desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative') && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
          />
        </div>
      </div>
      
      <div className="mt-4">
        {isMobile ? renderMobileActivityUI() : renderDesktopActivityUI()}
      </div>
    </div>
  );
};

export default OfficeActions;
