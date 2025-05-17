
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AppHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    try {
      // Store logout time in localStorage
      localStorage.setItem('guard-logout-time', new Date().toISOString());
      
      // Remove authentication token
      localStorage.removeItem('guard-token');
      
      // Show toast notification
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your session",
      });
      
      // Navigate back to login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">DELL Office Parking</h1>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <span>Logout</span>
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
};

export default AppHeader;
