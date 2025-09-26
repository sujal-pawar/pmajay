import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Shield, 
  Database, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  DollarSign,
  Map,
  Settings
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const navItems = [
    { label: 'Dashboard Overview', icon: <Activity className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'User Management', icon: <Users className="w-4 h-4" />, path: '/users' },
    { label: 'Role Management', icon: <Shield className="w-4 h-4" />, path: '/roles' },
    { label: 'System Settings', icon: <Settings className="w-4 h-4" />, path: '/settings' },
    { label: 'Audit Logs', icon: <FileText className="w-4 h-4" />, path: '/audit' },
    { label: 'Analytics', icon: <TrendingUp className="w-4 h-4" />, path: '/analytics' },
    { label: 'Financial Overview', icon: <DollarSign className="w-4 h-4" />, path: '/financial' },
    { label: 'Geographic Data', icon: <Map className="w-4 h-4" />, path: '/geography' },
  ];

  const stats = [
    { title: 'Total Users', value: '1,250', icon: <Users className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Active Projects', value: '450', icon: <Database className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Total Beneficiaries', value: '25,000', icon: <TrendingUp className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'System Alerts', value: '3', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-600' },
  ];

  return (
    <DashboardLayout
      title="Super Administrator"
      subtitle="Complete system control and oversight"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Welcome, Super Administrator</h2>
          <p className="text-blue-100">
            You have complete access to all system functions, user management, and cross-state analytics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Super Admins</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Central Admins</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">State Admins</span>
                  <span className="font-medium">280</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Field Users</span>
                  <span className="font-medium">950</span>
                </div>
                <Button className="w-full mt-4">Manage All Users</Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Server Uptime</span>
                  <span className="text-green-600 font-medium">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Status</span>
                  <span className="text-green-600 font-medium">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-green-600 font-medium">&lt; 200ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Sessions</span>
                  <span className="font-medium">1,847</span>
                </div>
                <Button variant="outline" className="w-full mt-4">View Detailed Metrics</Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Fund Allocated</span>
                  <span className="font-medium">₹5,000 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Funds Disbursed</span>
                  <span className="font-medium">₹3,750 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Approvals</span>
                  <span className="font-medium">₹125 Cr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilization Rate</span>
                  <span className="text-green-600 font-medium">75%</span>
                </div>
                <Button variant="outline" className="w-full mt-4">Financial Reports</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Recent System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">New state admin registered</p>
                    <p className="text-gray-500">Maharashtra - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Project approved</p>
                    <p className="text-gray-500">₹50L infrastructure project - 4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">System maintenance scheduled</p>
                    <p className="text-gray-500">Tomorrow 2:00 AM - 6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Security alert resolved</p>
                    <p className="text-gray-500">Failed login attempts - 1 day ago</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">View All Activity</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                Add User
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Shield className="w-6 h-6 mb-2" />
                Manage Roles
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="w-6 h-6 mb-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="w-6 h-6 mb-2" />
                System Config
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;