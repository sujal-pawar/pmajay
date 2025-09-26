import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Activity,
  FileText
} from 'lucide-react';

const DistrictCollectorDashboard = () => {
  const navItems = [
    { label: 'District Overview', icon: <Activity className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Project Coordination', icon: <MapPin className="w-4 h-4" />, path: '/projects' },
    { label: 'Beneficiary Management', icon: <Users className="w-4 h-4" />, path: '/beneficiaries' },
    { label: 'Performance Reports', icon: <TrendingUp className="w-4 h-4" />, path: '/reports' },
    { label: 'Inter-dept Coordination', icon: <FileText className="w-4 h-4" />, path: '/coordination' },
    { label: 'Resource Allocation', icon: <CheckCircle className="w-4 h-4" />, path: '/resources' },
  ];

  const stats = [
    { title: 'District Projects', value: '25', icon: <MapPin className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Beneficiaries Covered', value: '500', icon: <Users className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Fund Utilization', value: '78.5%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Completion Rate', value: '85.2%', icon: <CheckCircle className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const projectStatus = [
    { name: 'Infrastructure Development', total: 8, completed: 6, inProgress: 2, pending: 0 },
    { name: 'Education Programs', total: 6, completed: 4, inProgress: 1, pending: 1 },
    { name: 'Healthcare Initiatives', total: 7, completed: 5, inProgress: 2, pending: 0 },
    { name: 'Skill Development', total: 4, completed: 3, inProgress: 1, pending: 0 },
  ];

  const coordinationTasks = [
    { task: 'Review block-level reports', department: 'Revenue', priority: 'High', due: '2 days' },
    { task: 'Coordinate with PWD for roads', department: 'PWD', priority: 'Medium', due: '5 days' },
    { task: 'Health dept meeting', department: 'Health', priority: 'High', due: '1 day' },
    { task: 'Education survey review', department: 'Education', priority: 'Low', due: '1 week' },
  ];

  return (
    <DashboardLayout
      title="District Collector"
      subtitle="District-level coordination and oversight"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">District Administration Dashboard</h2>
          <p className="text-blue-100">
            Coordinate district-level PM-AJAY implementation, oversee inter-departmental activities, and monitor progress across all blocks.
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
          {/* Project Status by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Project Status by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStatus.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className="text-sm text-gray-600">Total: {category.total}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{category.completed}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{category.inProgress}</p>
                        <p className="text-xs text-gray-600">In Progress</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">{category.pending}</p>
                        <p className="text-xs text-gray-600">Pending</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View Detailed Reports</Button>
              </div>
            </CardContent>
          </Card>

          {/* Coordination Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Inter-Department Coordination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coordinationTasks.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.task}</h4>
                      <p className="text-sm text-gray-600">{item.department} • Due in {item.due}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${item.priority === 'High' ? 'bg-red-100 text-red-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Tasks</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Block Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Block A (Urban)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Block B (Rural)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Block C (Rural)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Block D (Tribal)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Beneficiary Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">78%</div>
                  <p className="text-sm text-gray-600">Overall Coverage</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>SC Community</span>
                    <span className="font-medium">425/500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verified Documents</span>
                    <span className="font-medium">380/425</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Issues & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Fund Delay</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Block C infrastructure project funding delayed</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Report Overdue</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">Block D monthly report pending for 3 days</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Review Required</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">5 beneficiary applications need approval</p>
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
                <FileText className="w-6 h-6 mb-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                Review Applications
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="w-6 h-6 mb-2" />
                Visit Project Site
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Activity className="w-6 h-6 mb-2" />
                Coordinate Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DistrictCollectorDashboard;