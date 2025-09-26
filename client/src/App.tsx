import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LoginNew from "./pages/LoginNew";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";

// Dashboard imports
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import CentralAdminDashboard from "./pages/dashboards/CentralAdminDashboard";
import StateNodalAdminDashboard from "./pages/dashboards/StateNodalAdminDashboard";
import StateSCCorporationAdminDashboard from "./pages/dashboards/StateSCCorporationAdminDashboard";
import DistrictCollectorDashboard from "./pages/dashboards/DistrictCollectorDashboard";
import DistrictPACCAdminDashboard from "./pages/dashboards/DistrictPACCAdminDashboard";
import ImplementingAgencyDashboard from "./pages/dashboards/ImplementingAgencyDashboard";
import GramPanchayatDashboard from "./pages/dashboards/GramPanchayatDashboard";
import ContractorVendorDashboard from "./pages/dashboards/ContractorVendorDashboard";
import AuditorOversightDashboard from "./pages/dashboards/AuditorOversightDashboard";
import TechnicalSupportDashboard from "./pages/dashboards/TechnicalSupportDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginNew />} />
            
            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard/super-admin"
              element={
                <ProtectedRoute requiredRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/central-admin"
              element={
                <ProtectedRoute requiredRoles={['central_admin']}>
                  <CentralAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/state-nodal-admin"
              element={
                <ProtectedRoute requiredRoles={['state_nodal_admin']}>
                  <StateNodalAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/state-sc-corporation-admin"
              element={
                <ProtectedRoute requiredRoles={['state_sc_corporation_admin']}>
                  <StateSCCorporationAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/district-collector"
              element={
                <ProtectedRoute requiredRoles={['district_collector']}>
                  <DistrictCollectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/district-pacc-admin"
              element={
                <ProtectedRoute requiredRoles={['district_pacc_admin']}>
                  <DistrictPACCAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/implementing-agency"
              element={
                <ProtectedRoute requiredRoles={['implementing_agency_user']}>
                  <ImplementingAgencyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/gram-panchayat"
              element={
                <ProtectedRoute requiredRoles={['gram_panchayat_user']}>
                  <GramPanchayatDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/contractor-vendor"
              element={
                <ProtectedRoute requiredRoles={['contractor_vendor']}>
                  <ContractorVendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/auditor-oversight"
              element={
                <ProtectedRoute requiredRoles={['auditor_oversight']}>
                  <AuditorOversightDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/technical-support"
              element={
                <ProtectedRoute requiredRoles={['technical_support_group']}>
                  <TechnicalSupportDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Generic dashboard route - redirects based on role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
