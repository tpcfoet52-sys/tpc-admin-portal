import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import PortalSelection from "./pages/PortalSelection";
import AdminLogin from "./pages/AdminLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ApprovalsManagement from "./pages/admin/ApprovalsManagement";
import UserManagement from "./pages/admin/UserManagement";
import ManageTeam from "./pages/admin/ManageTeam";
import ContentMediaDashboard from "./pages/coordinator/ContentMediaDashboard";
import EventHospitalityDashboard from "./pages/coordinator/EventHospitalityDashboard";


// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

// Placeholder for under construction pages
const PlaceholderAdminPage = ({ title }: { title: string }) => (
  <div className="space-y-6 text-center py-20">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-muted-foreground mt-4">This module is currently under development.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Main Selection */}
          <Route path="/" element={<PortalSelection />} />

          {/* Auth Redirects */}
          <Route path="/login" element={<Navigate to="/coordinator-login" replace />} />
          <Route path="/coordinator" element={<Navigate to="/coordinator-login" replace />} />

          {/* Login Pages */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/coordinator-login" element={<CoordinatorLogin />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="approvals" element={<ApprovalsManagement />} />
            <Route path="team" element={<ManageTeam />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="cms" element={<PlaceholderAdminPage title="Content Management" />} />
          </Route>

          {/* Coordinator Dashboards */}
          <Route path="/coordinator/events" element={
            <ProtectedRoute requiredTeam="Event & Hospitality Team">
              <EventHospitalityDashboard />
            </ProtectedRoute>
          } />
          <Route path="/coordinator/media" element={
            <ProtectedRoute requiredTeam="Content & Media Team">
              <ContentMediaDashboard />
            </ProtectedRoute>
          } />


          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
