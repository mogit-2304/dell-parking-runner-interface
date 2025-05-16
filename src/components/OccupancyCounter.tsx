
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RefreshCcw } from 'lucide-react';
import { Office } from '@/types/office';

interface OccupancyCounterProps {
  office: Office;
  isUpdating: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRefresh: () => void;
}

const OccupancyCounter: React.FC<OccupancyCounterProps> = ({ 
  office, 
  isUpdating, 
  onIncrement, 
  onDecrement, 
  onRefresh 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">{office.name}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh} 
          disabled={isUpdating}
        >
          <RefreshCcw className={isUpdating ? "animate-spin" : ""} />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-sm text-gray-500">Occupancy</div>
          <div className="text-2xl font-bold">{office.occupancy}/{office.capacity}</div>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <div className="text-sm text-gray-500">Available</div>
          <div className="text-2xl font-bold">{office.capacity - office.occupancy}</div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-6">
        <Button 
          size="lg"
          variant="outline"
          disabled={office.occupancy <= 0 || isUpdating}
          onClick={onDecrement}
        >
          <Minus className="mr-1" /> Exit
        </Button>
        
        <Button 
          size="lg"
          disabled={office.occupancy >= office.capacity || isUpdating}
          onClick={onIncrement}
        >
          <Plus className="mr-1" /> Enter
        </Button>
      </div>
    </div>
  );
};

export default OccupancyCounter;
