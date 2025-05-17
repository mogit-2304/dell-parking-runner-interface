
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuardLogin from "./pages/GuardLogin";
import SelectOffice from "./pages/SelectOffice";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected Route component to check for authentication
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const token = localStorage.getItem('guard-token');
  
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
      if (!token && window.location.pathname !== '/') {
        window.location.href = '/';
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
