import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRedirect = () => {
  const { user } = useAuth();

  console.log('DashboardRedirect: Current user:', user);

  if (!user) {
    console.log('DashboardRedirect: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Role-based dashboard routing
  const getDashboardPath = (role: string) => {
    const roleMap = {
      'super_admin': '/dashboard/super-admin',
      'central_admin': '/dashboard/central-admin',
      'state_nodal_admin': '/dashboard/state-nodal-admin',
      'state_sc_corporation_admin': '/dashboard/state-sc-corporation-admin',
      'district_collector': '/dashboard/district-collector',
      'district_pacc_admin': '/dashboard/district-pacc-admin',
      'implementing_agency_user': '/dashboard/implementing-agency',
      'gram_panchayat_user': '/dashboard/gram-panchayat',
      'contractor_vendor': '/dashboard/contractor-vendor',
      'auditor_oversight': '/dashboard/auditor-oversight',
      'technical_support_group': '/dashboard/technical-support'
    };

    return roleMap[role as keyof typeof roleMap] || '/dashboard/not-found';
  };

  const dashboardPath = getDashboardPath(user.role);
  console.log('DashboardRedirect: User role:', user.role, 'Dashboard path:', dashboardPath);

  return <Navigate to={dashboardPath} replace />;
};

export default DashboardRedirect;