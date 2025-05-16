
import React, { useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, LogIn, LogOut } from 'lucide-react';
import { useActivityFeed } from '@/hooks/useActivityFeed';
import { ActivityEvent } from '@/types/activityTypes';

export const ActivityFeed = () => {
  const { activities, loading, error, hasMore, loadMore } = useActivityFeed();
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Setup intersection observer for infinite scroll
  const lastActivityRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadMore]);
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Render activity item
  const ActivityItem = ({ activity, isLast }: { activity: ActivityEvent, isLast?: boolean }) => {
    const icon = activity.type === 'check-in' ? <LogIn className="h-4 w-4 text-green-500 mr-2" /> : <LogOut className="h-4 w-4 text-red-500 mr-2" />;
    const label = activity.type === 'check-in' ? 'Check-in' : 'Check-out';
    
    return (
      <div 
        ref={isLast ? lastActivityRef : null}
        className="flex items-center py-2 border-b border-gray-100 last:border-0"
      >
        {icon}
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">{label}</span> – {activity.officeName} – {formatTimestamp(activity.timestamp)}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Recent Activity"
        >
          <Bell className="h-5 w-5" />
          {activities.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {error && (
              <p className="text-center py-4 text-red-500">Failed to load activities</p>
            )}
            
            {!loading && activities.length === 0 && (
              <p className="text-center py-4 text-gray-400">No recent activity</p>
            )}
            
            {activities.map((activity, index) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                isLast={index === activities.length - 1}
              />
            ))}
            
            {loading && (
              <p className="text-center py-2 text-gray-400">Loading...</p>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
