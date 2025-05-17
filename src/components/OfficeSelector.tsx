
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';
import { Office } from '@/types/officeTypes';

interface OfficeSelectorProps {
  offices: Office[];
  selectedOfficeId: string | undefined;
  onSelectOffice: (officeId: string) => void;
}

const OfficeSelector = ({ offices, selectedOfficeId, onSelectOffice }: OfficeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="font-medium text-sm block">{t('officeLocation')}</label>
        <LanguageSelector />
      </div>
      <Select onValueChange={onSelectOffice} value={selectedOfficeId || ""}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('selectOffice')} />
        </SelectTrigger>
        <SelectContent>
          {offices.map(office => (
            <SelectItem key={office.id} value={office.id}>
              {office.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OfficeSelector;
