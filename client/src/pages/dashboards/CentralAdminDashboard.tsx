import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  TrendingUp, 
  DollarSign, 
  FileCheck, 
  Users,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CentralAdminDashboard = () => {
  const navItems = [
    { label: 'National Overview', icon: <Activity className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'State Performance', icon: <Map className="w-4 h-4" />, path: '/states' },
    { label: 'Fund Management', icon: <DollarSign className="w-4 h-4" />, path: '/funds' },
    { label: 'Project Approvals', icon: <FileCheck className="w-4 h-4" />, path: '/approvals' },
    { label: 'Compliance Reports', icon: <CheckCircle className="w-4 h-4" />, path: '/compliance' },
    { label: 'Beneficiary Analytics', icon: <Users className="w-4 h-4" />, path: '/beneficiaries' },
    { label: 'Performance Reports', icon: <TrendingUp className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'Active States', value: '28', icon: <Map className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Funds Disbursed', value: '₹3,750 Cr', icon: <DollarSign className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Projects Under Review', value: '125', icon: <FileCheck className="w-6 h-6" />, color: 'text-orange-600' },
    { title: 'Compliance Rate', value: '94.5%', icon: <CheckCircle className="w-6 h-6" />, color: 'text-purple-600' },
  ];

  const statePerformance = [
    { state: 'Uttar Pradesh', projects: 45, funds: '₹250 Cr', compliance: '96%', status: 'Excellent' },
    { state: 'Maharashtra', projects: 38, funds: '₹220 Cr', compliance: '94%', status: 'Good' },
    { state: 'Bihar', projects: 42, funds: '₹180 Cr', compliance: '92%', status: 'Good' },
    { state: 'Rajasthan', projects: 35, funds: '₹200 Cr', compliance: '89%', status: 'Average' },
    { state: 'Tamil Nadu', projects: 40, funds: '₹190 Cr', compliance: '97%', status: 'Excellent' },
  ];

  return (
    <DashboardLayout
      title="Central Administrator"
      subtitle="National-level program oversight and control"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Central Administration Dashboard</h2>
          <p className="text-green-100">
            Monitor nationwide PM-AJAY implementation, manage fund disbursals, and oversee compliance across all states.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* State Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="w-5 h-5 mr-2 text-blue-600" />
                Top Performing States
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statePerformance.map((state, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{state.state}</h4>
                      <p className="text-sm text-gray-600">
                        {state.projects} projects • {state.funds} allocated
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{state.compliance}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${state.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                          state.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {state.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4">View All States</Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Fund Release</p>
                    <p className="text-sm text-gray-600">Gujarat - ₹45 Cr</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Project Approval</p>
                    <p className="text-sm text-gray-600">Karnataka - Infrastructure</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Budget Revision</p>
                    <p className="text-sm text-gray-600">Odisha - ₹25 Cr</p>
                  </div>
                  <Button size="sm">Review</Button>
                </div>
                <Button variant="outline" className="w-full">View All Pending</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fund Allocation Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Fund Allocation by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Infrastructure Development</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">₹1,625 Cr</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Education Programs</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">₹1,125 Cr</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Healthcare Initiatives</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-sm font-medium">₹875 Cr</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Skill Development</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">₹625 Cr</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Implementation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Progress</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fund Utilization</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Beneficiary Coverage</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compliance Rate</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
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
                <DollarSign className="w-6 h-6 mb-2" />
                Approve Funds
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileCheck className="w-6 h-6 mb-2" />
                Review Projects
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Map className="w-6 h-6 mb-2" />
                State Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CentralAdminDashboard;