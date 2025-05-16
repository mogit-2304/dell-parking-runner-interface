
import { Activity } from '@/types/activity';

// Mock storage for activity data
let activities: Activity[] = [];

// Initialize with some sample data if in development
if (import.meta.env.DEV) {
  const now = new Date();
  const generatePastDate = (minutes: number) => new Date(now.getTime() - minutes * 60000);
  
  activities = [
    {
      id: '1',
      type: 'check-in',
      officeName: 'Dell HQ',
      timestamp: generatePastDate(5)
    },
    {
      id: '2',
      type: 'check-out',
      officeName: 'Dell Main',
      timestamp: generatePastDate(15)
    },
    {
      id: '3',
      type: 'check-in',
      officeName: 'Dell HQ',
      timestamp: generatePastDate(45)
    },
    {
      id: '4',
      type: 'check-out',
      officeName: 'Dell HQ',
      timestamp: generatePastDate(120)
    },
    {
      id: '5',
      type: 'check-in',
      officeName: 'Dell Main',
      timestamp: generatePastDate(180)
    }
  ];
}

export const activityService = {
  // Get recent activities with pagination
  getRecentActivities: async (limit: number = 5, offset: number = 0): Promise<Activity[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  },
  
  // Add a new activity
  addActivity: async (activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date()
    };
    
    activities.unshift(newActivity);
    return newActivity;
  },
  
  // Get total count of activities
  getTotalCount: async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return activities.length;
  }
};
