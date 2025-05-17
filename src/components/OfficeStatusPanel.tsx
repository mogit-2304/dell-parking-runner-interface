
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Office } from '@/types/officeTypes';

interface OfficeStatusPanelProps {
  office: Office;
}

const OfficeStatusPanel = ({ office }: OfficeStatusPanelProps) => {
  const { t } = useTranslation();

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
                : t('occupiedPercentage', Math.round((office.occupancy / office.capacity) * 100))
              }
            </div>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                office.occupancy / office.capacity > 0.8 
                  ? 'bg-red-500' 
                  : office.occupancy / office.capacity > 0.5 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(100, (office.occupancy / office.capacity) * 100)}%` }}
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
