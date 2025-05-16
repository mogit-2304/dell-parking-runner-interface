
export interface Activity {
  id: string;
  type: 'check-in' | 'check-out';
  officeName: string;
  timestamp: Date;
}
