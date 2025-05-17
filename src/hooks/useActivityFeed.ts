
import { useState, useEffect, useCallback } from 'react';
import { ActivityEvent } from '../types/activityTypes';

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial activity data
  useEffect(() => {
    fetchActivities();
  }, []);
  
  // Fetch activities from storage or mock data
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if we have stored activities
      const storedActivities = localStorage.getItem('activityEvents');
      let eventsData: ActivityEvent[] = [];
      
      if (storedActivities) {
        eventsData = JSON.parse(storedActivities);
      }
      
      // Update state with all activities (we'll limit display in the component)
      setActivities(eventsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity data');
      setLoading(false);
    }
  }, []);
  
  // Refresh activities - exposed for manual and auto-refresh
  const refreshActivities = useCallback(() => {
    fetchActivities();
  }, [fetchActivities]);
  
  // Record a new activity event
  const recordActivity = useCallback((type: 'check-in' | 'check-out', officeName: string) => {
    try {
      // Create new activity object
      const newActivity: ActivityEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type,
        officeName,
        timestamp: new Date().toISOString()
      };
      
      // Get existing activities
      const storedActivities = localStorage.getItem('activityEvents');
      let activitiesArray: ActivityEvent[] = [];
      
      if (storedActivities) {
        activitiesArray = JSON.parse(storedActivities);
      }
      
      // Add new activity at the beginning (most recent first)
      activitiesArray = [newActivity, ...activitiesArray];
      
      // Store updated list
      localStorage.setItem('activityEvents', JSON.stringify(activitiesArray));
      
      // Update state
      setActivities(prev => [newActivity, ...prev]);
      
      return true;
    } catch (err) {
      console.error('Error recording activity:', err);
      return false;
    }
  }, []);
  
  return {
    activities,
    loading,
    error,
    refreshActivities,
    recordActivity
  };
};
