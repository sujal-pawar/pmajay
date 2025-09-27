import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RoleDashboardRouter from './RoleDashboardRouter';

const DashboardRedirect = () => {
  const { user } = useAuth();

  console.log('DashboardRedirect: Current user:', user);

  if (!user) {
    console.log('DashboardRedirect: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Use the role-based dashboard router
  return <RoleDashboardRouter />;
};

export default DashboardRedirect;