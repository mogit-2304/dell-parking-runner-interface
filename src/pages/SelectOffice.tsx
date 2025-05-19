import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import OfficeActions from '@/components/OfficeActions';
import { useTranslation } from '@/hooks/useTranslation';
import { useOffices } from '@/hooks/useOffices';
import OfficeSelector from '@/components/OfficeSelector';
import OfficeStatusPanel from '@/components/OfficeStatusPanel';
import { Office } from '@/types/officeTypes';

const SelectOffice = () => {
  const { t } = useTranslation();
  const { offices, loading, error, updateOfficeOccupancy, fetchOffices } = useOffices();
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false);

  // Handle office selection
  const handleSelectOffice = useCallback((officeId: string) => {
    const office = offices.find(o => o.id === officeId);
    if (office) {
      setSelectedOffice(office);
      console.log('Selected office:', office);
    }
  }, [offices]);

  // Auto-select first office when offices load
  React.useEffect(() => {
    if (offices.length > 0 && !selectedOffice) {
      setSelectedOffice(offices[0]);
      console.log('Auto-selected first office:', offices[0]);
    }
  }, [offices, selectedOffice]);

  // Retry loading offices
  const handleRetry = () => {
    fetchOffices();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p>Loading offices...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Unable to load offices</AlertTitle>
                <AlertDescription>
                  There was a problem loading the office data.
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Button onClick={handleRetry}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AppHeader />
      <div className="flex-1 p-4">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardContent className="space-y-6 pt-6">
            <OfficeSelector 
              offices={offices}
              selectedOfficeId={selectedOffice?.id}
              onSelectOffice={handleSelectOffice}
            />
            
            {selectedOffice ? (
              <div className="space-y-6">
                <OfficeStatusPanel office={selectedOffice} />
                
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <h4 className="font-semibold text-lg mb-4">{t('vehicleEntryExit')}</h4>
                  <OfficeActions 
                    office={selectedOffice}
                    showDebugInfo={showDebugInfo}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border">
                <p className="text-gray-500">{t('pleaseSelectOffice')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SelectOffice;
