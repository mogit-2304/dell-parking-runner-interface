
import React, { useEffect, useState } from 'react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { toast } from '@/hooks/use-toast';
import SliderCTA from './SliderCTA';
import { Office } from '@/types/officeTypes';
import { useTranslation } from '@/hooks/useTranslation';
import { ActivityDropdown } from './ActivityDropdown';
import VehicleNumberDialog from './VehicleNumberDialog';

interface OfficeActionsProps {
  office: Office;
  onUpdate: (newOccupancy: number) => void;
  showDebugInfo?: boolean;
}

const OfficeActions = ({ office, onUpdate, showDebugInfo = false }: OfficeActionsProps) => {
  const { recordActivity } = useActivityFeed();
  const { t } = useTranslation();
  const [entryCount, setEntryCount] = useState(0);
  const [exitCount, setExitCount] = useState(0);
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'entry' | 'exit';
    newOccupancy: number;
  } | null>(null);

  // Debug on initial render and when office changes
  useEffect(() => {
    console.log('OfficeActions rendered with office:', office);
  }, [office]);

  // Reset counters when office changes and load persisted counter state
  useEffect(() => {
    // Try to load persisted counter values for this specific office
    const persistedEntryCount = localStorage.getItem(`entryCount-${office.id}`);
    const persistedExitCount = localStorage.getItem(`exitCount-${office.id}`);
    
    // Set counters - either from persisted values or calculated from occupancy
    setEntryCount(persistedEntryCount ? parseInt(persistedEntryCount, 10) : office.occupancy);
    setExitCount(persistedExitCount ? parseInt(persistedExitCount, 10) : office.capacity - office.occupancy);
    
    console.log('Counter state restored for office', office.id);
  }, [office.id, office.occupancy, office.capacity]);

  // Persist counter values whenever they change
  useEffect(() => {
    localStorage.setItem(`entryCount-${office.id}`, entryCount.toString());
    localStorage.setItem(`exitCount-${office.id}`, exitCount.toString());
    console.log('Counter state persisted for office', office.id);
  }, [entryCount, exitCount, office.id]);

  // Handle increment occupancy (check-in)
  const handleIncrement = async () => {
    console.log('handleIncrement called - Starting with occupancy:', office.occupancy);
    
    // Check if at capacity
    if (office.occupancy >= office.capacity) {
      toast({
        title: t('parkingFull'),
        description: t('parkingAtCapacity', office.name),
        variant: "destructive",
      });
      return;
    }

    try {
      // Update occupancy
      const newOccupancy = office.occupancy + 1;
      
      console.log('handleIncrement - Current:', office.occupancy, 'New:', newOccupancy);
      
      // Store pending action and show vehicle dialog
      setPendingAction({
        type: 'entry',
        newOccupancy
      });
      setShowVehicleDialog(true);
      
    } catch (err) {
      console.error('Error in handleIncrement:', err);
      toast({
        title: t('errorUpdatingOccupancy'),
        description: t('failedToUpdate'),
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
        title: t('noVehiclesToExit'),
        description: t('parkingEmpty', office.name),
        variant: "destructive",
      });
      return;
    }

    try {
      // Update occupancy
      const newOccupancy = office.occupancy - 1;
      
      console.log('handleDecrement - Current:', office.occupancy, 'New:', newOccupancy);
      
      // Store pending action and show vehicle dialog
      setPendingAction({
        type: 'exit',
        newOccupancy
      });
      setShowVehicleDialog(true);
      
    } catch (err) {
      console.error('Error in handleDecrement:', err);
      toast({
        title: t('errorUpdatingOccupancy'),
        description: t('failedToUpdate'),
        variant: "destructive",
      });
    }
  };

  // Handle vehicle dialog confirmation
  const handleVehicleDialogConfirm = async (vehicleNumber: string) => {
    if (!pendingAction) return;

    try {
      const { type, newOccupancy } = pendingAction;
      
      // Record the activity
      recordActivity(type, office.name, office.id, vehicleNumber);
      
      // Update the entry/exit counter
      if (type === 'entry') {
        setEntryCount(prevCount => prevCount + 1);
      } else {
        setExitCount(prevCount => prevCount + 1);
      }
      
      // Call the onUpdate callback with the new occupancy
      console.log('About to call onUpdate with newOccupancy:', newOccupancy);
      onUpdate(newOccupancy);
      
      // Display toast confirmation
      toast({
        title: type === 'entry' ? t('vehicleEntered') : t('vehicleExited'),
        description: vehicleNumber ? `${t('vehicleNumber')}: ${vehicleNumber}` : "",
      });
      
    } catch (err) {
      console.error('Error in handleVehicleDialogConfirm:', err);
      toast({
        title: t('errorUpdatingOccupancy'),
        description: t('failedToUpdate'),
        variant: "destructive",
      });
    } finally {
      setPendingAction(null);
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
            slideText={t('slideToEnter')}
            releaseText={t('releaseToEnter')}
            successText={t('vehicleEntered')}
            disabled={office.occupancy >= office.capacity}
            showDebugInfo={showDebugInfo}
            counter={entryCount}
          />
        </div>
        
        <div>
          <SliderCTA
            onComplete={() => {
              console.log('SliderCTA Exit onComplete triggered');
              handleDecrement();
            }}
            slideText={t('slideToExit')}
            releaseText={t('releaseToExit')}
            successText={t('vehicleExited')}
            disabled={office.occupancy <= 0}
            direction="rtl"
            showDebugInfo={showDebugInfo}
            counter={exitCount}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-center">
          <ActivityDropdown />
        </div>
      </div>

      <VehicleNumberDialog
        isOpen={showVehicleDialog}
        onClose={() => setShowVehicleDialog(false)}
        onConfirm={handleVehicleDialogConfirm}
        actionType={pendingAction?.type || 'entry'}
      />
    </div>
  );
};

export default OfficeActions;
