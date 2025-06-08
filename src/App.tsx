
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Sales from "./pages/Sales";
import Calendar from "./pages/Calendar";
import OwnGoods from "./pages/OwnGoods";
import StateGoods from "./pages/StateGoods";
import Scheduler from "./pages/scheduler"
import NotFound from "./pages/NotFound";
import LoginPage from "./auth/login";
import ProtectedRoute from './components/protectedRoutes';
import MobileProtectedRoute from "./components/protected-route-mobile";

const queryClient = new QueryClient();

function App() {
  const token = localStorage.getItem("sb-ampmxcwgavcmaifozqbd-auth-token")

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/mobile-only" element={
                <MobileProtectedRoute>
                  <Route path="/dashboard/products" element={<Index />} />
                  <Route path="/dashboard/categories" element={<Categories />} />
                  <Route path="/dashboard/sales" element={<Sales />} />
                  <Route path="/dashboard/calendar" element={<Calendar />} />
                  <Route path="/dashboard/own-goods" element={<OwnGoods />} />
                  <Route path="/dashboard/state-goods" element={<StateGoods />} />
                </MobileProtectedRoute>
              } />
              <Route element={<ProtectedRoute token={token} />}>
                <Route path="/dashboard/products" element={<Index />} />
                <Route path="/dashboard/categories" element={<Categories />} />
                <Route path="/dashboard/sales" element={<Sales />} />
                <Route path="/dashboard/calendar" element={<Calendar />} />
                <Route path="/dashboard/own-goods" element={<OwnGoods />} />
                <Route path="/dashboard/state-goods" element={<StateGoods />} />
              </Route>
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
