
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

const AppHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleLogout = () => {
    try {
      // Store logout time in localStorage
      localStorage.setItem('guard-logout-time', new Date().toISOString());
      
      // Remove authentication token
      localStorage.removeItem('guard-token');
      
      // Show simplified toast notification
      toast({
        title: t('logoutSuccessful'),
      });
      
      // Navigate back to login page
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: t('logoutFailed'),
        description: t('logoutIssue'),
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/b3ecde46-910c-4cab-8d3f-63e1447f2f46.png" 
          alt="Move in Sync Logo" 
          className="h-16 w-auto" 
        />
        <h1 className="text-xl font-bold">DELL Parking Management</h1>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <span>{t('logout')}</span>
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
};

export default AppHeader;
