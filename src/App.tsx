import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ContentMediaDashboard from "./pages/coordinator/ContentMediaDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";

// Import Admin components
import AdminLayout from "./components/admin/AdminLayout";
import DashboardOverview from "./pages/admin/DashboardOverview";
import EventHospitalityDashboard from "./pages/coordinator/EventHospitalityDashboard";
import ApprovalsManagement from "./pages/admin/ApprovalsManagement";
import UserManagement from "./pages/admin/UserManagement";
import ManageTeam from "./pages/admin/ManageTeam";

const queryClient = new QueryClient();

// A simple placeholder component for admin pages that are under construction
const PlaceholderAdminPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-navy-900 dark:text-white">{title}</h1>
      <p className="text-muted-foreground mt-2">This module is currently under development.</p>
    </div>
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center bg-gray-50/50 dark:bg-gray-800/50">
      <div className="rounded-full bg-gray-100 p-3 mb-4 dark:bg-gray-800">
        <svg
          className="h-6 w-6 text-gray-400"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium">Content coming soon</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
        We are working hard to bring you the {title.toLowerCase()} feature.
      </p>
    </div>
  </div>
);

import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Default Route redirects to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Coordinator Routes */}
          <Route path="/coordinator-login" element={<CoordinatorLogin />} />
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

          {/* Admin Login - Standalone Page */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Dashboard - Protected Area with Sidebar Layout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />

            <Route path="approvals" element={<ApprovalsManagement />} />
            <Route path="team" element={<ManageTeam />} />

            {/* Placeholder Pages for Sidebar Links */}
            <Route path="users" element={<UserManagement />} />
            <Route path="cms" element={<PlaceholderAdminPage title="Content Management" />} />
          </Route>

          {/* Catch-all route shows NotFound page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

