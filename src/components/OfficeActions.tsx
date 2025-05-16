
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useActivityFeed } from '@/hooks/useActivityFeed';

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

  // Handle increment occupancy (check-in)
  const handleIncrement = async () => {
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
      onUpdate(newOccupancy);
      
      // Record the activity
      recordActivity('check-in', office.name);
      
    } catch (err) {
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle decrement occupancy (check-out)
  const handleDecrement = async () => {
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
      onUpdate(newOccupancy);
      
      // Record the activity
      recordActivity('check-out', office.name);
      
    } catch (err) {
      toast({
        title: "Error updating occupancy",
        description: "Failed to update parking occupancy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center space-x-6">
      <Button 
        size="lg"
        variant="outline"
        disabled={office.occupancy <= 0}
        onClick={handleDecrement}
      >
        <Minus className="mr-1" /> Exit
      </Button>
      
      <Button 
        size="lg"
        disabled={office.occupancy >= office.capacity}
        onClick={handleIncrement}
      >
        <Plus className="mr-1" /> Enter
      </Button>
    </div>
  );
};

export default OfficeActions;
