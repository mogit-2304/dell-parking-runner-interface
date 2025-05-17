
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
      
      // Show simplified toast notification
      toast({
        title: "Logout successful",
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
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/cd1fd69e-1d4b-4806-b4d9-7e6f77ea9e11.png" 
          alt="Move in Sync Logo" 
          className="h-16 w-auto" // Increased height from h-10 to h-16
        />
        <h1 className="text-xl font-bold">DELL Parking Management</h1>
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
