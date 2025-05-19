import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuardLogin from "./pages/GuardLogin";
import SelectOffice from "./pages/SelectOffice";
import { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";

// Create a style for mobile viewport height adjustment
const appStyle = {
  height: '100%',
  width: '100%',
  overflow: 'auto'
};

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
    
    // Set up mobile viewport height fix for iOS/Android
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initial setup and event listener for resize
    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <div style={appStyle}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
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
        </LanguageProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
