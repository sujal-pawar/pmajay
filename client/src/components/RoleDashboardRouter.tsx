import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../lib/permissions';
import DashboardLayout from './DashboardLayout';
import CentralDashboard from './dashboards/CentralDashboard';
import StateDashboard from './dashboards/StateDashboard';
import DistrictDashboard from './dashboards/DistrictDashboard';
import DistrictCollectorDashboard from './dashboards/DistrictCollectorDashboard';
import DistrictPACCDashboard from './dashboards/DistrictPACCDashboard';
import GramPanchayatDashboard from './dashboards/GramPanchayatDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  BarChart3,
  FileText,
  Users,
  Settings,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const RoleDashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getDashboardNavItems = () => {
    const baseItems = [
      {
        label: 'Overview',
        icon: <BarChart3 className="w-4 h-4" />,
        path: '/dashboard',
        active: true
      }
    ];

    // Add role-specific navigation items
    switch (user.role) {
      case 'central_admin':
      case 'super_admin':
        return [
          ...baseItems,
          {
            label: 'All Projects',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/projects',
            active: false
          },
          {
            label: 'States Overview',
            icon: <MapPin className="w-4 h-4" />,
            path: '/dashboard/states',
            active: false
          },
          {
            label: 'Fund Management',
            icon: <TrendingUp className="w-4 h-4" />,
            path: '/dashboard/funds',
            active: false
          },
          {
            label: 'User Management',
            icon: <Users className="w-4 h-4" />,
            path: '/dashboard/users',
            active: false
          },
          {
            label: 'System Settings',
            icon: <Settings className="w-4 h-4" />,
            path: '/dashboard/settings',
            active: false
          }
        ];

      case 'state_nodal_admin':
      case 'state_sc_corporation_admin':
        return [
          ...baseItems,
          {
            label: 'State Projects',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/projects',
            active: false
          },
          {
            label: 'Districts',
            icon: <MapPin className="w-4 h-4" />,
            path: '/dashboard/districts',
            active: false
          },
          {
            label: 'Approvals',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/approvals',
            active: false
          },
          {
            label: 'Fund Allocation',
            icon: <TrendingUp className="w-4 h-4" />,
            path: '/dashboard/funds',
            active: false
          }
        ];

      case 'district_collector':
      case 'district_pacc_admin':
        return [
          ...baseItems,
          {
            label: 'District Projects',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/projects',
            active: false
          },
          {
            label: 'Milestones',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/milestones',
            active: false
          },
          {
            label: 'Beneficiaries',
            icon: <Users className="w-4 h-4" />,
            path: '/dashboard/beneficiaries',
            active: false
          },
          {
            label: 'Approvals',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/approvals',
            active: false
          }
        ];

      case 'gram_panchayat_user':
        return [
          ...baseItems,
          {
            label: 'Verification',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/verification',
            active: false
          },
          {
            label: 'Local Projects',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/projects',
            active: false
          },
          {
            label: 'Beneficiaries',
            icon: <Users className="w-4 h-4" />,
            path: '/dashboard/beneficiaries',
            active: false
          },
          {
            label: 'Field Reports',
            icon: <AlertTriangle className="w-4 h-4" />,
            path: '/dashboard/reports',
            active: false
          }
        ];

      case 'implementing_agency_user':
        return [
          ...baseItems,
          {
            label: 'Assigned Projects',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/projects',
            active: false
          },
          {
            label: 'Progress Updates',
            icon: <TrendingUp className="w-4 h-4" />,
            path: '/dashboard/progress',
            active: false
          },
          {
            label: 'Milestones',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/milestones',
            active: false
          }
        ];

      case 'contractor_vendor':
        return [
          ...baseItems,
          {
            label: 'My Contracts',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/contracts',
            active: false
          },
          {
            label: 'Work Progress',
            icon: <TrendingUp className="w-4 h-4" />,
            path: '/dashboard/progress',
            active: false
          },
          {
            label: 'Payments',
            icon: <TrendingUp className="w-4 h-4" />,
            path: '/dashboard/payments',
            active: false
          }
        ];

      case 'auditor_oversight':
        return [
          ...baseItems,
          {
            label: 'Audit Reports',
            icon: <FileText className="w-4 h-4" />,
            path: '/dashboard/audits',
            active: false
          },
          {
            label: 'Compliance',
            icon: <CheckCircle className="w-4 h-4" />,
            path: '/dashboard/compliance',
            active: false
          },
          {
            label: 'Issues',
            icon: <AlertTriangle className="w-4 h-4" />,
            path: '/dashboard/issues',
            active: false
          }
        ];

      default:
        return baseItems;
    }
  };

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'central_admin':
      case 'super_admin':
        return 'Central Dashboard';
      case 'state_nodal_admin':
      case 'state_sc_corporation_admin':
        return 'State Dashboard';
      case 'district_collector':
      case 'district_pacc_admin':
        return 'District Dashboard';
      case 'gram_panchayat_user':
        return 'Gram Panchayat Dashboard';
      case 'implementing_agency_user':
        return 'Agency Dashboard';
      case 'contractor_vendor':
        return 'Contractor Dashboard';
      case 'auditor_oversight':
        return 'Audit Dashboard';
      case 'technical_support_group':
        return 'Technical Dashboard';
      default:
        return 'PM-AJAY Dashboard';
    }
  };

  const getDashboardSubtitle = () => {
    const jurisdiction = user.jurisdiction;
    if (!jurisdiction) return 'Project monitoring and management';

    const parts = [];
    if (jurisdiction.village) parts.push(jurisdiction.village);
    if (jurisdiction.block) parts.push(jurisdiction.block);
    if (jurisdiction.district) parts.push(jurisdiction.district);
    if (jurisdiction.state) parts.push(jurisdiction.state);

    return parts.length > 0 ? parts.join(', ') : 'Project monitoring and management';
  };

  const renderDashboardContent = () => {
    // Central Government roles
    if (hasPermission(user, PERMISSIONS.READ_ALL_DATA)) {
      return <CentralDashboard />;
    }
    
    // State Government roles
    if (hasPermission(user, PERMISSIONS.MANAGE_STATE_DATA) || user.role === 'state_nodal_admin' || user.role === 'state_sc_corporation_admin') {
      return <StateDashboard />;
    }
    
    // District Collector - specialized dashboard
    if (user.role === 'district_collector') {
      return <DistrictCollectorDashboard />;
    }
    
    // District PACC Admin - specialized dashboard
    if (user.role === 'district_pacc_admin') {
      return <DistrictPACCDashboard />;
    }
    
    // Other district level roles
    if (hasPermission(user, PERMISSIONS.MANAGE_DISTRICT_DATA)) {
      return <DistrictDashboard />;
    }
    
    // Gram Panchayat and field level roles
    if (user.role === 'gram_panchayat_user' || hasPermission(user, PERMISSIONS.VILLAGE_VERIFICATION)) {
      return <GramPanchayatDashboard />;
    }

    // For other roles like implementing agency, contractor, auditor
    // Show a generic project-focused dashboard
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to PM-AJAY Portal</CardTitle>
            <CardDescription>
              Your role-specific dashboard is being set up. Please contact your administrator for access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Role</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.role}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.department && `Department: ${user.department}`}
                    {user.agency && `Agency: ${user.agency}`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Permissions</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.permissions.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active permissions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jurisdiction</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {user.jurisdiction?.state || 'National'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.jurisdiction?.district && `${user.jurisdiction.district}`}
                    {user.jurisdiction?.block && `, ${user.jurisdiction.block}`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Actions</CardTitle>
            <CardDescription>Based on your role and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasPermission(user, PERMISSIONS.READ_ALL_DATA) && (
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">View Projects</h4>
                    <p className="text-sm text-gray-600">Access project information</p>
                  </div>
                </div>
              )}
              
              {hasPermission(user, PERMISSIONS.UPDATE_PROGRESS) && (
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Update Progress</h4>
                    <p className="text-sm text-gray-600">Submit progress reports</p>
                  </div>
                </div>
              )}
              
              {hasPermission(user, PERMISSIONS.VERIFY_MILESTONE) && (
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">Verify Milestones</h4>
                    <p className="text-sm text-gray-600">Approve completed work</p>
                  </div>
                </div>
              )}
              
              {hasPermission(user, PERMISSIONS.MANAGE_BENEFICIARIES) && (
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-semibold">Manage Beneficiaries</h4>
                    <p className="text-sm text-gray-600">Handle beneficiary data</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout
      title={getDashboardTitle()}
      subtitle={getDashboardSubtitle()}
      navItems={getDashboardNavItems()}
    >
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default RoleDashboardRouter;