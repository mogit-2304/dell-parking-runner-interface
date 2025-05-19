
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Office } from '@/types/officeTypes';
import { Progress } from '@/components/ui/progress';

interface OfficeStatusPanelProps {
  office: Office;
}

const OfficeStatusPanel = ({ office }: OfficeStatusPanelProps) => {
  const { t } = useTranslation();
  const occupancyPercentage = Math.round((office.occupancy / office.capacity) * 100);

  return (
    <div className="bg-white rounded-lg p-6 border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">{t('parkingStatus', office.name)}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">{t('currentOccupancy')}</div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold">{office.occupancy}/{office.capacity}</div>
            <div className="text-sm text-gray-500">
              {office.occupancy === office.capacity 
                ? t('parkingFull')
                : t('occupiedPercentage', occupancyPercentage)
              }
            </div>
          </div>
          <div className="mt-2">
            <Progress 
              value={occupancyPercentage} 
              className="h-2 bg-gray-200" 
              indicatorClassName="bg-[#ea384c]" 
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm text-gray-500 mb-1">{t('availableSlots')}</div>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-green-600">{office.capacity - office.occupancy}</div>
            <div className="text-sm text-green-600">
              {office.capacity - office.occupancy === 0
                ? t('noSpaces')
                : t('availablePercentage', Math.round(((office.capacity - office.occupancy) / office.capacity) * 100))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeStatusPanel;
