
export interface ActivityEvent {
  id: string;
  type: 'check-in' | 'check-out';
  officeName: string;
  timestamp: string; // ISO string format
  vehicleNumber?: string;
}
