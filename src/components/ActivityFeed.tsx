
import React, { useRef, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn, LogOut } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityEvent } from '@/types/activityTypes';

export const ActivityFeed = () => {
  const { activities, loading, error, refreshActivities } = useActivityFeed();
  
  // Limiting the activities to the most recent 20
  const limitedActivities = activities.slice(0, 20);
  
  // Auto refresh activities every minute
  useEffect(() => {
    // Initial load is handled by the hook itself
    
    // Set up interval for refreshing activities
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing activities');
      refreshActivities();
    }, 60000); // 60000 ms = 1 minute
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshActivities]);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Render activity item
  const ActivityItem = ({ activity }: { activity: ActivityEvent }) => {
    const icon = activity.type === 'check-in' ? <LogIn className="h-4 w-4 text-green-500 mr-2" /> : <LogOut className="h-4 w-4 text-red-500 mr-2" />;
    const label = activity.type === 'check-in' ? 'Check-in' : 'Check-out';
    
    return (
      <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
        {icon}
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">{label}</span> – {activity.officeName} – {formatTimestamp(activity.timestamp)}
          </p>
          {activity.vehicleNumber && (
            <p className="text-xs text-gray-500">
              Vehicle: {activity.vehicleNumber}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <ScrollArea className="h-[300px]">
      <div className="p-2">
        {error && (
          <p className="text-center py-4 text-red-500">Failed to load activities</p>
        )}
        
        {!loading && limitedActivities.length === 0 && (
          <p className="text-center py-4 text-gray-400">No recent activity</p>
        )}
        
        {limitedActivities.map((activity) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity}
          />
        ))}
        
        {loading && (
          <p className="text-center py-2 text-gray-400">Loading...</p>
        )}

        {/* Message at the bottom */}
        {activities.length > 0 && (
          <div className="border-t border-gray-100 mt-2 pt-2">
            <p className="text-center text-xs text-gray-500">
              Showing last {Math.min(20, activities.length)} actions. Contact admin for older records.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
