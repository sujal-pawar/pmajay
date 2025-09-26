import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
  Target
} from 'lucide-react';

const ImplementingAgencyDashboard = () => {
  const navItems = [
    { label: 'Project Dashboard', icon: <Target className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Implementation Plans', icon: <Settings className="w-4 h-4" />, path: '/plans' },
    { label: 'Beneficiary Services', icon: <Users className="w-4 h-4" />, path: '/beneficiaries' },
    { label: 'Progress Tracking', icon: <TrendingUp className="w-4 h-4" />, path: '/progress' },
    { label: 'Financial Management', icon: <DollarSign className="w-4 h-4" />, path: '/finance' },
    { label: 'Reports & Compliance', icon: <FileText className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'Active Projects', value: '12', icon: <Target className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Beneficiaries Served', value: '2,456', icon: <Users className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Budget Utilized', value: '₹45.2L', icon: <DollarSign className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Compliance Score', value: '94%', icon: <CheckCircle className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const currentProjects = [
    { 
      name: 'Skill Development Program', 
      progress: 85, 
      status: 'On Track', 
      budget: '₹12.5L',
      deadline: '15 Feb 2025',
      beneficiaries: 450 
    },
    { 
      name: 'Healthcare Access Initiative', 
      progress: 70, 
      status: 'Needs Attention', 
      budget: '₹18.3L',
      deadline: '28 Mar 2025',
      beneficiaries: 680 
    },
    { 
      name: 'Education Support Program', 
      progress: 92, 
      status: 'Ahead of Schedule', 
      budget: '₹8.7L',
      deadline: '10 Jan 2025',
      beneficiaries: 320 
    },
  ];

  const todaysTasks = [
    { task: 'Submit monthly progress report', priority: 'High', deadline: 'Today, 5 PM' },
    { task: 'Review beneficiary applications (15)', priority: 'High', deadline: 'Today' },
    { task: 'Vendor payment approval', priority: 'Medium', deadline: 'Tomorrow' },
    { task: 'Site visit - Skill Center', priority: 'Medium', deadline: '2 days' },
    { task: 'Team meeting - Project review', priority: 'Low', deadline: '3 days' },
  ];

  const recentActivities = [
    { activity: 'Approved 25 beneficiary applications', time: '2 hours ago', type: 'approval' },
    { activity: 'Submitted compliance report', time: '5 hours ago', type: 'report' },
    { activity: 'Completed site inspection', time: '1 day ago', type: 'inspection' },
    { activity: 'Disbursed funds to vendors', time: '2 days ago', type: 'payment' },
  ];

  return (
    <DashboardLayout
      title="Implementing Agency"
      subtitle="Project execution and beneficiary services"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Implementation Dashboard</h2>
          <p className="text-green-100">
            Manage project execution, track beneficiary services, and ensure timely delivery of PM-AJAY initiatives.
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
          {/* Current Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Current Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                          project.status === 'Needs Attention' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-medium">{project.budget}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-medium">{project.deadline}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Beneficiaries</p>
                          <p className="font-medium">{project.beneficiaries}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View All Projects</Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Today's Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.task}</h4>
                      <p className="text-sm text-gray-600">{task.deadline}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Tasks</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">96%</div>
                  <p className="text-sm text-gray-600">Target Achievement</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beneficiaries Served</span>
                    <span className="text-sm font-medium">456/475</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Projects Completed</span>
                    <span className="text-sm font-medium">8/8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Budget Utilization</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality Score</span>
                    <span className="text-sm font-medium">4.7/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Financial Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-700">Total Allocated</div>
                  <div className="text-xl font-bold text-purple-900">₹52.5 Lakhs</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">Utilized</div>
                  <div className="text-xl font-bold text-green-900">₹45.2 Lakhs</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">Remaining</div>
                  <div className="text-xl font-bold text-blue-900">₹7.3 Lakhs</div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilization Rate</span>
                    <span>86%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2
                      ${activity.type === 'approval' ? 'bg-green-500' :
                        activity.type === 'report' ? 'bg-blue-500' :
                        activity.type === 'inspection' ? 'bg-orange-500' :
                        'bg-purple-500'}`}>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Activity Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Important Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Important Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Report Due Today</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Monthly progress report must be submitted by 5 PM</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Budget Review Needed</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">Healthcare project budget needs revision approval</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Pending Applications</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">15 beneficiary applications awaiting review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-16 flex-col">
                  <FileText className="w-5 h-5 mb-1" />
                  Submit Report
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Users className="w-5 h-5 mb-1" />
                  Review Applications
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <DollarSign className="w-5 h-5 mb-1" />
                  Process Payments
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Target className="w-5 h-5 mb-1" />
                  Site Inspection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImplementingAgencyDashboard;