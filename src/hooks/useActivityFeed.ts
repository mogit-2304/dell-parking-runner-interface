
import { useState, useEffect } from 'react';
import { ActivityEvent } from '../types/activityTypes';

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Fetch initial activity data
  useEffect(() => {
    fetchActivities();
  }, []);
  
  // Fetch activities from storage or mock data
  const fetchActivities = async (nextPage = 1) => {
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
      
      // If no stored activities and first page, create empty array
      if (!eventsData.length && nextPage === 1) {
        eventsData = [];
      }
      
      // Paginate results - 10 per page
      const pageSize = 10;
      const startIndex = (nextPage - 1) * pageSize;
      const paginatedEvents = eventsData.slice(startIndex, startIndex + pageSize);
      
      // Check if we have more pages
      setHasMore(startIndex + pageSize < eventsData.length);
      
      // Update state
      if (nextPage === 1) {
        setActivities(paginatedEvents);
      } else {
        setActivities(prev => [...prev, ...paginatedEvents]);
      }
      
      setPage(nextPage);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity data');
      setLoading(false);
    }
  };
  
  // Load more activities
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchActivities(page + 1);
    }
  };
  
  // Record a new activity event
  const recordActivity = (type: 'check-in' | 'check-out', officeName: string) => {
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
      setActivities(prev => [newActivity, ...prev].slice(0, prev.length + 1));
      
      return true;
    } catch (err) {
      console.error('Error recording activity:', err);
      return false;
    }
  };
  
  return {
    activities,
    loading,
    error,
    hasMore,
    loadMore,
    recordActivity
  };
};
