import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Catering from "./pages/Catering";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ServicesManager from "./pages/admin/ServicesManager";
import ZonesManager from "./pages/admin/ZonesManager";
import BookingsManager from "./pages/admin/BookingsManager";
import ManageChats from "./pages/admin/ManageChats";
import ManageReports from "./pages/admin/ManageReports";
import ManageUsers from "./pages/admin/ManageUsers";
import ManagePermissions from "./pages/admin/ManagePermissions";
import SystemLogs from "./pages/admin/SystemLogs";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/catering" element={<Catering />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="zones" element={<ZonesManager />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="bookings" element={<BookingsManager />} />
            <Route path="chats" element={<ManageChats />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="permissions" element={<ManagePermissions />} />
            <Route path="logs" element={<SystemLogs />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
