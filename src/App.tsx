
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuardLogin from "./pages/GuardLogin";
import SelectOffice from "./pages/SelectOffice";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected Route component to check for authentication
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('guard-token');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store current path in localStorage for later restoration
  useEffect(() => {
    if (token) {
      localStorage.setItem('last-path', location.pathname);
      console.log('Saving current path:', location.pathname);
    }
  }, [location.pathname, token]);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

const App = () => {
  // Effect to check token on app initialization and route changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('guard-token');
      
      // If not authenticated and not on login page, redirect to login
      if (!token && window.location.pathname !== '/') {
        window.location.href = '/';
        return;
      }
      
      // If authenticated and on login page, redirect to last path or select office
      if (token && window.location.pathname === '/') {
        const lastPath = localStorage.getItem('last-path');
        if (lastPath && lastPath !== '/') {
          console.log('Restoring last path:', lastPath);
          window.location.href = lastPath;
        } else {
          window.location.href = '/select-office';
        }
      }
    };
    
    checkAuth();
    
    // Listen for storage events (in case token is removed in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'guard-token' && !e.newValue) {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuardLogin />} />
            <Route path="/select-office" element={<ProtectedRoute element={<SelectOffice />} />} />
            <Route path="/home" element={<ProtectedRoute element={<Index />} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
