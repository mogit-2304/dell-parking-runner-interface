
import { useState, useEffect, useCallback } from 'react';
import { Office } from '@/types/officeTypes';
import { supabase } from '@/integrations/supabase/client';

export const useOffices = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch offices from Supabase
  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('offices')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setOffices(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offices:', err);
      setError('Unable to load offices');
      setLoading(false);
    }
  }, []);

  // Update office occupancy
  const updateOfficeOccupancy = useCallback(async (officeId: string, newOccupancy: number) => {
    try {
      // Update occupancy in Supabase
      const { error } = await supabase
        .from('offices')
        .update({ occupancy: newOccupancy, updated_at: new Date().toISOString() })
        .eq('id', officeId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setOffices(prevOffices => {
        return prevOffices.map(office => {
          if (office.id === officeId) {
            return { ...office, occupancy: newOccupancy };
          }
          return office;
        });
      });
      
      return true;
    } catch (err) {
      console.error('Error updating office occupancy:', err);
      return false;
    }
  }, []);

  // Load offices on component mount
  useEffect(() => {
    fetchOffices();
    
    // Set up realtime subscription for office changes
    const channel = supabase
      .channel('public:offices')
      .on('postgres_changes', { 
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public', 
        table: 'offices' 
      }, payload => {
        // Handle different event types
        if (payload.eventType === 'INSERT') {
          setOffices(prev => [...prev, payload.new as Office]);
        } else if (payload.eventType === 'UPDATE') {
          setOffices(prev => 
            prev.map(office => 
              office.id === payload.new.id ? { ...office, ...payload.new } : office
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setOffices(prev => 
            prev.filter(office => office.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [fetchOffices]);

  return {
    offices,
    loading,
    error,
    fetchOffices,
    updateOfficeOccupancy
  };
};
