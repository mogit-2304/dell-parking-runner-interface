
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { CarFront } from 'lucide-react';

interface VehicleNumberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (vehicleNumber: string) => void;
  actionType: 'entry' | 'exit';
}

const VehicleNumberDialog = ({ isOpen, onClose, onConfirm, actionType }: VehicleNumberDialogProps) => {
  const { t } = useTranslation();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Validate the vehicle number format: XX-NN-XX-NNNN (e.g., KA 01 AB 1234)
  const validateVehicleNumber = (value: string): boolean => {
    // If empty, it's valid (user can choose to skip)
    if (!value) return true;

    // Format: XX-NN-XX-NNNN (e.g., KA 01 AB 1234)
    // Where X = alphabet, N = number
    const regex = /^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$/;
    return regex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVehicleNumber(value);
    
    if (value && !validateVehicleNumber(value)) {
      setError(t('invalidVehicleFormat'));
    } else {
      setError(null);
    }
  };

  const handleConfirm = () => {
    if (vehicleNumber && !validateVehicleNumber(vehicleNumber)) {
      setError(t('invalidVehicleFormat'));
      return;
    }
    
    onConfirm(vehicleNumber);
    setVehicleNumber('');
    setError(null);
    onClose();
  };

  const handleSkip = () => {
    onConfirm('');
    setVehicleNumber('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CarFront className="h-5 w-5" />
            {actionType === 'entry' ? t('vehicleEntryDetails') : t('vehicleExitDetails')}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="vehicleNumber" className="block text-sm font-medium mb-1">
                {t('vehicleNumber')}
              </label>
              <Input
                id="vehicleNumber"
                value={vehicleNumber}
                onChange={handleInputChange}
                placeholder="KA 01 AB 1234"
                className="w-full"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('formatXXNNXXNNNN')}
              </p>
              {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
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

export default VehicleNumberDialog;
