
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface VehicleNumberModalProps {
  isOpen: boolean;
  activityType: 'check-in' | 'check-out';
  onClose: (vehicleNumber?: string) => void;
}

const VehicleNumberModal: React.FC<VehicleNumberModalProps> = ({
  isOpen,
  activityType,
  onClose
}) => {
  const { t } = useTranslation();
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const handleConfirm = () => {
    onClose(vehicleNumber);
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {activityType === 'check-in' 
              ? t('vehicleNumberEntranceTitle') 
              : t('vehicleNumberExitTitle')}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder={t('vehicleNumberPlaceholder')}
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            className="mb-2"
            autoFocus
          />
          <p className="text-sm text-muted-foreground">
            {activityType === 'check-in' 
              ? t('vehicleNumberEntranceDescription')
              : t('vehicleNumberExitDescription')}
          </p>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleSkip}>
            {t('skip')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleNumberModal;
