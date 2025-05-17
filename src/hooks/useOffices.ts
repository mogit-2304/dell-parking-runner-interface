
import { useState, useEffect, useCallback } from 'react';
import { Office } from '@/types/officeTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

  // Update office occupancy with optimistic concurrency control
  const updateOfficeOccupancy = useCallback(async (officeId: string, newOccupancy: number) => {
    try {
      // Find the current office in local state to get its version
      const currentOffice = offices.find(office => office.id === officeId);
      
      if (!currentOffice) {
        throw new Error('Office not found in local state');
      }
      
      // Update occupancy in Supabase with version check
      const { data, error } = await supabase
        .from('offices')
        .update({ 
          occupancy: newOccupancy, 
          updated_at: new Date().toISOString()
        })
        .eq('id', officeId)
        .eq('version', currentOffice.version)
        .select();
      
      if (error) {
        throw error;
      }
      
      // If no rows were returned, it means the version check failed
      if (!data || data.length === 0) {
        // Fetch the latest version of the office
        const { data: latestOffice } = await supabase
          .from('offices')
          .select('*')
          .eq('id', officeId)
          .single();
          
        // Show conflict error
        toast({
          title: "Update conflict detected",
          description: "Office data was updated by someone else. The latest data has been loaded.",
          variant: "destructive"
        });
        
        // Update local state with the latest data
        setOffices(prev => 
          prev.map(office => 
            office.id === officeId ? (latestOffice as Office) : office
          )
        );
        
        return false;
      }
      
      // Update local state
      setOffices(prevOffices => {
        return prevOffices.map(office => {
          if (office.id === officeId) {
            // Use the returned data which has the updated version number
            return data[0] as Office;
          }
          return office;
        });
      });
      
      return true;
    } catch (err) {
      console.error('Error updating office occupancy:', err);
      toast({
        title: "Error updating occupancy",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  }, [offices]);

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
