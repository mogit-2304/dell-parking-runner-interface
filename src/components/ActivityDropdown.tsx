
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import { useTranslation } from '@/hooks/useTranslation';

export const ActivityDropdown = () => {
  const { t } = useTranslation();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1 text-sm font-medium"
        >
          <span>{t('recentActivity')}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="center" side="bottom" sideOffset={5} alignOffset={0}>
        <DropdownMenuLabel className="font-semibold">
          {t('recentActivity')}
        </DropdownMenuLabel>
        <div className="max-h-[300px] overflow-auto bg-white">
          <ActivityFeed />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
