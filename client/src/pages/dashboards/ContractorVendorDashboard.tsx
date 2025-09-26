import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Truck,
  Users
} from 'lucide-react';

const ContractorVendorDashboard = () => {
  const navItems = [
    { label: 'Project Overview', icon: <Wrench className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Contract Management', icon: <FileText className="w-4 h-4" />, path: '/contracts' },
    { label: 'Project Execution', icon: <Calendar className="w-4 h-4" />, path: '/execution' },
    { label: 'Resource Management', icon: <Truck className="w-4 h-4" />, path: '/resources' },
    { label: 'Financial Tracking', icon: <DollarSign className="w-4 h-4" />, path: '/finance' },
    { label: 'Progress Reports', icon: <TrendingUp className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'Active Contracts', value: '8', icon: <FileText className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Projects Completed', value: '24', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Contract Value', value: '₹12.5Cr', icon: <DollarSign className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'On-time Delivery', value: '95%', icon: <Clock className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const activeProjects = [
    { 
      name: 'Community Center Construction', 
      location: 'Gram Panchayat A',
      progress: 85, 
      status: 'On Track', 
      budget: '₹2.5Cr',
      deadline: '15 Nov 2025',
      workersDeployed: 25,
      phase: 'Interior Work'
    },
    { 
      name: 'Road Development Project', 
      location: 'Village B-C Connecting Road',
      progress: 45, 
      status: 'Behind Schedule', 
      budget: '₹4.2Cr',
      deadline: '30 Dec 2025',
      workersDeployed: 40,
      phase: 'Foundation Work'
    },
    { 
      name: 'School Building Renovation', 
      location: 'Primary School, Village D',
      progress: 75, 
      status: 'On Track', 
      budget: '₹1.8Cr',
      deadline: '20 Oct 2025',
      workersDeployed: 15,
      phase: 'Finishing Work'
    },
  ];

  const financialSummary = [
    { category: 'Payments Received', amount: '₹8.5Cr', percentage: 68, status: 'good' },
    { category: 'Pending Payments', amount: '₹2.3Cr', percentage: 18, status: 'warning' },
    { category: 'Material Costs', amount: '₹4.2Cr', percentage: 34, status: 'info' },
    { category: 'Labor Costs', amount: '₹3.1Cr', percentage: 25, status: 'info' },
  ];

  const upcomingMilestones = [
    { project: 'Community Center Construction', milestone: 'Final Inspection', date: 'Oct 5, 2025', priority: 'High' },
    { project: 'Road Development Project', milestone: 'Mid-term Review', date: 'Oct 15, 2025', priority: 'High' },
    { project: 'School Building Renovation', milestone: 'Handover Ceremony', date: 'Oct 25, 2025', priority: 'Medium' },
    { project: 'Water Supply System', milestone: 'Quality Testing', date: 'Nov 2, 2025', priority: 'Medium' },
  ];

  const recentActivities = [
    { activity: 'Submitted progress report for Community Center', time: '2 hours ago', type: 'report' },
    { activity: 'Received material delivery for Road Project', time: '1 day ago', type: 'delivery' },
    { activity: 'Completed safety inspection', time: '2 days ago', type: 'inspection' },
    { activity: 'Payment received for School Renovation', time: '3 days ago', type: 'payment' },
  ];

  const resourceStatus = [
    { resource: 'Heavy Machinery', available: 8, deployed: 6, maintenance: 1 },
    { resource: 'Skilled Workers', available: 85, deployed: 80, training: 5 },
    { resource: 'Raw Materials', stock: 'Good', orders: 3, delivery: '2 days' },
    { resource: 'Vehicles', available: 12, deployed: 10, service: 2 },
  ];

  return (
    <DashboardLayout
      title="Contractor/Vendor"
      subtitle="Project execution and contract management"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Contractor Dashboard</h2>
          <p className="text-amber-100">
            Manage project execution, track contract milestones, and ensure timely delivery of PM-AJAY infrastructure projects.
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
          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.location}</p>
                        <p className="text-xs text-gray-500">Phase: {project.phase}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                          project.status === 'Behind Schedule' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            project.status === 'On Track' ? 'bg-green-500' :
                            project.status === 'Behind Schedule' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-medium">{project.budget}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-medium">{project.deadline}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Workers</p>
                          <p className="font-medium">{project.workersDeployed}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View All Projects</Button>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialSummary.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{item.category}</h4>
                      <span className="text-lg font-bold text-gray-900">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'good' ? 'bg-green-500' :
                          item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.percentage}% of total contract value
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Detailed Financial Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Management and Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2 text-purple-600" />
                Resource Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourceStatus.map((resource, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{resource.resource}</h4>
                    {resource.available !== undefined ? (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Available</p>
                          <p className="font-medium text-green-600">{resource.available}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deployed</p>
                          <p className="font-medium text-blue-600">{resource.deployed}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{resource.maintenance ? 'Maintenance' : resource.training ? 'Training' : 'Service'}</p>
                          <p className="font-medium text-orange-600">{resource.maintenance || resource.training || resource.service}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Stock</p>
                          <p className="font-medium text-green-600">{resource.stock}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Orders</p>
                          <p className="font-medium text-blue-600">{resource.orders}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delivery</p>
                          <p className="font-medium text-orange-600">{resource.delivery}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{milestone.milestone}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${milestone.priority === 'High' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {milestone.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{milestone.project}</p>
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Project Timeline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2
                      ${activity.type === 'report' ? 'bg-blue-500' :
                        activity.type === 'delivery' ? 'bg-green-500' :
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

        {/* Action Items and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Priority Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Project Behind Schedule</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Road Development Project needs immediate attention to meet deadline</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Payment Follow-up</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">₹2.3Cr pending payment approval - follow up with district office</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Resource Allocation</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Deploy additional workers to Community Center for timely completion</p>
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
                  <Calendar className="w-5 h-5 mb-1" />
                  Update Timeline
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Truck className="w-5 h-5 mb-1" />
                  Request Resources
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <DollarSign className="w-5 h-5 mb-1" />
                  Track Payments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractorVendorDashboard;