
import { useState, useEffect, useCallback } from 'react';
import { ActivityEvent } from '../types/activityTypes';
import { supabase } from '@/integrations/supabase/client';

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch initial activity data from Supabase
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch activities from Supabase
      const { data, error } = await supabase
        .from('activity_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      
      if (error) {
        throw error;
      }
      
      // Transform data to match ActivityEvent type
      const eventsData: ActivityEvent[] = data.map(event => ({
        id: event.id,
        type: event.type as 'check-in' | 'check-out',
        officeName: event.office_name,
        timestamp: event.timestamp,
        vehicleNumber: event.vehicle_number
      }));
      
      // Update state with activities
      setActivities(eventsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity data');
      setLoading(false);
    }
  }, []);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchActivities();
    
    // Set up realtime subscription for activity events
    const channel = supabase
      .channel('public:activity_events')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'activity_events' 
      }, payload => {
        // Add new activity to the list
        const newActivity: ActivityEvent = {
          id: payload.new.id,
          type: payload.new.type as 'check-in' | 'check-out',
          officeName: payload.new.office_name,
          timestamp: payload.new.timestamp,
          vehicleNumber: payload.new.vehicle_number
        };
        
        setActivities(prev => [newActivity, ...prev].slice(0, 20));
      })
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [fetchActivities]);
  
  // Manual refresh function
  const refreshActivities = useCallback(() => {
    fetchActivities();
  }, [fetchActivities]);
  
  // Record a new activity event
  const recordActivity = useCallback(async (
    type: 'check-in' | 'check-out', 
    officeName: string, 
    officeId: string,
    vehicleNumber?: string
  ) => {
    try {
      // Create new activity object
      const newActivity = {
        type,
        office_name: officeName,
        office_id: officeId,
        timestamp: new Date().toISOString(),
        vehicle_number: vehicleNumber || null
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from('activity_events')
        .insert([newActivity]);
      
      if (error) {
        throw error;
      }
      
      // Refresh activities (realtime will handle updating the UI)
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
