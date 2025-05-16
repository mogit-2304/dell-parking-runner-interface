
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Activity } from '@/types/activity';
import { activityService } from '@/services/activityService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivityDropdownProps {
  className?: string;
}

const RecentActivityDropdown: React.FC<RecentActivityDropdownProps> = ({ className }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
  
  // Initial load
  useEffect(() => {
    if (open) {
      loadActivities();
    }
  }, [open]);
  
  const loadActivities = async (reset = true) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const offset = reset ? 0 : activities.length;
      const newActivities = await activityService.getRecentActivities(5, offset);
      
      if (newActivities.length < 5) {
        setHasMore(false);
      }
      
      setActivities(reset ? newActivities : [...activities, ...newActivities]);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const handleLoadMore = async () => {
    await loadActivities(false);
  };
  
  const getActivityIcon = (type: 'check-in' | 'check-out') => {
    return type === 'check-in' ? <LogIn className="h-4 w-4 text-green-500" /> : <LogOut className="h-4 w-4 text-red-500" />;
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}>
          <Clock className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto">
        <DropdownMenuLabel className="font-bold">Recent Activity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="px-2 py-4 text-center text-gray-500">
            No recent activity
          </div>
        ) : (
          <>
            {activities.map((activity) => (
              <div key={activity.id} className="px-2 py-2 hover:bg-gray-100 rounded-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div>
                    <div className="font-medium">
                      {activity.type === 'check-in' ? 'Check-in' : 'Check-out'} – {activity.officeName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {hasMore && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2" 
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </Button>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RecentActivityDropdown;
