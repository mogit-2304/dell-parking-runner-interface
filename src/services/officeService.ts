
import { Office } from '@/types/office';

// Mock data for offices
const mockOffices: Office[] = [
  { id: 'hq', name: 'Dell HQ', capacity: 50, occupancy: 10, version: 1 },
  { id: 'main', name: 'Dell Main', capacity: 156, occupancy: 20, version: 1 }
];

export const officeService = {
  // Simulate getting latest office data
  getOffices: async (): Promise<Office[]> => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    const persistedOffices = localStorage.getItem('offices');
    return persistedOffices ? JSON.parse(persistedOffices) : mockOffices;
  },

  // Simulate updating office with version check (optimistic concurrency control)
  updateOffice: async (officeId: string, newOccupancy: number, version: number | undefined): Promise<Office> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Get current state
    const offices = JSON.parse(localStorage.getItem('offices') || JSON.stringify(mockOffices));
    const office = offices.find((o: Office) => o.id === officeId);
    
    if (!office) {
      throw new Error('Office not found');
    }

    // Version check for concurrency control
    if (version !== undefined && office.version !== version) {
      // Return a specific error for concurrency conflicts
      const error = new Error('Conflict: Office data was updated by another user');
      error.name = 'ConcurrencyError';
      throw error;
    }

    // Update and save
    office.occupancy = newOccupancy;
    office.version = (office.version || 0) + 1;
    
    localStorage.setItem('offices', JSON.stringify(offices));
    return office;
  }
};
