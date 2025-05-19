
import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import SliderCTA from './SliderCTA';
import VehicleNumberModal from '@/components/VehicleNumberModal';
import { useTranslation } from '@/hooks/useTranslation';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { supabase } from '@/integrations/supabase/client';

interface OfficeActionsProps {
  office: {
    id: string;
    name: string;
    capacity: number;
    occupancy: number;
  };
}

const OfficeActions = ({ office }: OfficeActionsProps) => {
  const { t } = useTranslation();
  const { recordActivity } = useActivityFeed();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [currentActivityType, setCurrentActivityType] = useState<'check-in' | 'check-out'>('check-in');
  const isFull = office.occupancy >= office.capacity;
  const isEmpty = office.occupancy === 0;
  const [isLoading, setIsLoading] = useState(false);
  const [checkInCount, setCheckInCount] = useState(0);
  const [checkOutCount, setCheckOutCount] = useState(0);

  // Get counters from local storage on component mount
  React.useEffect(() => {
    const storedCounters = localStorage.getItem(`office-counters-${office.id}`);
    if (storedCounters) {
      const { checkIn, checkOut } = JSON.parse(storedCounters);
      setCheckInCount(checkIn || 0);
      setCheckOutCount(checkOut || 0);
    }
  }, [office.id]);

  // Function to persist counter state to local storage
  const persistCounterState = (officeId: string, counters: { checkIn: number, checkOut: number }) => {
    localStorage.setItem(`office-counters-${officeId}`, JSON.stringify(counters));
  };

  // Function to increment office occupancy
  const incrementOccupancy = async () => {
    if (office.occupancy >= office.capacity) {
      toast.error(t('parkingLotFull'));
      return false;
    }

    try {
      setIsLoading(true);
      
      // Update the occupancy in Supabase
      const { error } = await supabase
        .from('offices')
        .update({ occupancy: office.occupancy + 1 })
        .eq('id', office.id);

      if (error) {
        throw error;
      }

      // Update the local state as well
      office.occupancy += 1;
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error incrementing occupancy:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Function to decrement office occupancy
  const decrementOccupancy = async () => {
    if (office.occupancy <= 0) {
      toast.error(t('parkingLotEmpty'));
      return false;
    }

    try {
      setIsLoading(true);
      
      // Update the occupancy in Supabase
      const { error } = await supabase
        .from('offices')
        .update({ occupancy: office.occupancy - 1 })
        .eq('id', office.id);

      if (error) {
        throw error;
      }

      // Update the local state as well
      office.occupancy -= 1;
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error decrementing occupancy:', error);
      setIsLoading(false);
      return false;
    }
  };

  const handleVehicleEntry = useCallback(() => {
    if (isFull) {
      toast.error(t('parkingLotFull'));
      return;
    }
    setCurrentActivityType('check-in');
    setShowVehicleModal(true);
  }, [isFull, t]);

  const handleVehicleExit = useCallback(() => {
    if (isEmpty) {
      toast.error(t('parkingLotEmpty'));
      return;
    }
    setCurrentActivityType('check-out');
    setShowVehicleModal(true);
  }, [isEmpty, t]);

  const handleVehicleModalClose = useCallback((vehicleNumber?: string) => {
    const action = currentActivityType === 'check-in' 
      ? incrementOccupancy 
      : decrementOccupancy;
    
    const message = currentActivityType === 'check-in'
      ? t('vehicleEntered')
      : t('vehicleExited');
    
    action().then(result => {
      if (result) {
        // Record activity with or without vehicle number
        recordActivity(
          currentActivityType, 
          office.name, 
          office.id,
          vehicleNumber
        );
        
        // Show toast and update counters
        toast.success(message);
        
        if (currentActivityType === 'check-in') {
          setCheckInCount(prev => prev + 1);
          persistCounterState(office.id, {
            checkIn: checkInCount + 1,
            checkOut: checkOutCount
          });
        } else {
          setCheckOutCount(prev => prev + 1);
          persistCounterState(office.id, {
            checkIn: checkInCount,
            checkOut: checkOutCount + 1
          });
        }
      } else {
        toast.error(t('operationFailed'));
      }
      
      setShowVehicleModal(false);
    });
  }, [currentActivityType, incrementOccupancy, decrementOccupancy, t, office, recordActivity, checkInCount, checkOutCount, persistCounterState]);

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <h3 className="font-bold text-xl">{t('officeActions')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">{t('vehicleEntry')}</div>
          <div className="mt-4">
            <SliderCTA
              onComplete={handleVehicleEntry}
              slideText={t('slideToEnter')}
              releaseText={t('releaseToEnter')}
              successText={t('vehicleProcessing')}
              accentColor="#22c55e" // Green
              direction="ltr"
              disabled={isLoading || isFull}
              counter={checkInCount}
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">{t('vehicleExit')}</div>
          <div className="mt-4">
            <SliderCTA
              onComplete={handleVehicleExit}
              slideText={t('slideToExit')}
              releaseText={t('releaseToExit')}
              successText={t('vehicleProcessing')}
              accentColor="#ef4444" // Red
              direction="rtl"
              disabled={isLoading || isEmpty}
              counter={checkOutCount}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Number Modal */}
      <VehicleNumberModal
        isOpen={showVehicleModal}
        activityType={currentActivityType}
        onClose={handleVehicleModalClose}
      />
    </div>
  );
};

export default OfficeActions;
