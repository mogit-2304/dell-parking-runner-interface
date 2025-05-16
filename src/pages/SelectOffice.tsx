
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecentActivityDropdown from '@/components/RecentActivityDropdown';
import OccupancyCounter from '@/components/OccupancyCounter';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useOfficeManagement } from '@/hooks/useOfficeManagement';

const SelectOffice = () => {
  const {
    offices,
    selectedOffice,
    loading,
    error,
    isUpdating,
    fetchOffices,
    handleSelectOffice,
    handleIncrement,
    handleDecrement
  } = useOfficeManagement();

  // Initial data fetching
  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  // Handle loading state
  if (loading) {
    return <LoadingState />;
  }

  // Handle error state
  if (error) {
    return <ErrorState onRetry={fetchOffices} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Select Office</CardTitle>
          <RecentActivityDropdown />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="font-medium text-sm mb-2 block">Office Location</label>
            <Select onValueChange={handleSelectOffice} defaultValue={selectedOffice?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Select an office" />
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
          
          {selectedOffice && (
            <OccupancyCounter
              office={selectedOffice}
              isUpdating={isUpdating}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRefresh={fetchOffices}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectOffice;
