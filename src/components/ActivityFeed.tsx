
import React, { useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogIn, LogOut } from 'lucide-react';
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
  );
};
