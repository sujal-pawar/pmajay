import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Monitor, 
  TrendingUp, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Code,
  Users,
  HelpCircle,
  Database
} from 'lucide-react';

const TechnicalSupportDashboard = () => {
  const navItems = [
    { label: 'System Overview', icon: <Monitor className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Technical Support', icon: <Settings className="w-4 h-4" />, path: '/support' },
    { label: 'System Maintenance', icon: <Zap className="w-4 h-4" />, path: '/maintenance' },
    { label: 'User Management', icon: <Users className="w-4 h-4" />, path: '/users' },
    { label: 'Database Administration', icon: <Database className="w-4 h-4" />, path: '/database' },
    { label: 'Documentation', icon: <FileText className="w-4 h-4" />, path: '/docs' },
  ];

  const stats = [
    { title: 'System Uptime', value: '99.8%', icon: <Zap className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Active Users', value: '2,847', icon: <Users className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Support Tickets', value: '24', icon: <HelpCircle className="w-6 h-6" />, color: 'text-orange-600' },
    { title: 'System Health', value: '95%', icon: <Monitor className="w-6 h-6" />, color: 'text-purple-600' },
  ];

  const systemMetrics = [
    { service: 'Authentication Service', status: 'Healthy', uptime: '99.9%', responseTime: '< 100ms' },
    { service: 'Database Cluster', status: 'Healthy', uptime: '99.8%', responseTime: '< 50ms' },
    { service: 'File Storage Service', status: 'Warning', uptime: '98.2%', responseTime: '< 200ms' },
    { service: 'Notification Service', status: 'Healthy', uptime: '99.7%', responseTime: '< 150ms' },
    { service: 'Report Generation', status: 'Healthy', uptime: '99.5%', responseTime: '< 300ms' },
  ];

  const supportTickets = [
    { 
      id: 'TECH-2024-158',
      title: 'Login issues for District Collector users',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Tech Team A',
      reportedBy: 'Pune District Office',
      createdDate: '2025-09-25',
      estimatedResolution: '2 hours'
    },
    { 
      id: 'TECH-2024-159',
      title: 'Report generation timeout in State dashboard',
      priority: 'Medium',
      status: 'Under Investigation',
      assignedTo: 'Backend Team',
      reportedBy: 'State Nodal Admin',
      createdDate: '2025-09-24',
      estimatedResolution: '4 hours'
    },
    { 
      id: 'TECH-2024-160',
      title: 'Mobile app sync issues',
      priority: 'Low',
      status: 'Resolved',
      assignedTo: 'Mobile Team',
      reportedBy: 'Gram Panchayat User',
      createdDate: '2025-09-22',
      estimatedResolution: 'Completed'
    },
  ];

  const systemAlerts = [
    { 
      type: 'Warning',
      message: 'File Storage Service experiencing high latency',
      timestamp: '10 minutes ago',
      severity: 'Medium',
      action: 'Monitoring increased load'
    },
    { 
      type: 'Info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2 hours ago',
      severity: 'Low',
      action: 'All services restored'
    },
    { 
      type: 'Critical',
      message: 'Database backup completed with warnings',
      timestamp: '6 hours ago',
      severity: 'High',
      action: 'Review backup logs'
    },
  ];

  const userActivity = [
    { role: 'Super Admin', activeUsers: 2, totalUsers: 3, loginRate: '67%' },
    { role: 'Central Admin', activeUsers: 8, totalUsers: 12, loginRate: '67%' },
    { role: 'State Nodal Admin', activeUsers: 25, totalUsers: 28, loginRate: '89%' },
    { role: 'District Collector', activeUsers: 156, totalUsers: 180, loginRate: '87%' },
    { role: 'Gram Panchayat User', activeUsers: 1250, totalUsers: 1450, loginRate: '86%' },
    { role: 'Implementing Agency', activeUsers: 85, totalUsers: 95, loginRate: '89%' },
  ];

  const recentActivities = [
    { activity: 'System backup completed successfully', time: '1 hour ago', type: 'maintenance' },
    { activity: 'New user registration: 15 Gram Panchayat users', time: '3 hours ago', type: 'user' },
    { activity: 'Database optimization completed', time: '6 hours ago', type: 'performance' },
    { activity: 'Security patch applied to authentication service', time: '1 day ago', type: 'security' },
  ];

  const maintenanceSchedule = [
    { task: 'Database index rebuilding', scheduled: 'Oct 2, 2025 02:00 AM', duration: '2 hours', impact: 'Low' },
    { task: 'Security updates deployment', scheduled: 'Oct 5, 2025 01:00 AM', duration: '30 minutes', impact: 'None' },
    { task: 'File storage migration', scheduled: 'Oct 10, 2025 12:00 AM', duration: '4 hours', impact: 'Medium' },
  ];

  const performanceMetrics = [
    { metric: 'API Response Time', current: '125ms', target: '< 200ms', trend: 'good' },
    { metric: 'Database Query Time', current: '45ms', target: '< 100ms', trend: 'good' },
    { metric: 'Page Load Time', current: '1.8s', target: '< 3s', trend: 'good' },
    { metric: 'Error Rate', current: '0.2%', target: '< 1%', trend: 'good' },
  ];

  return (
    <DashboardLayout
      title="Technical Support Group"
      subtitle="System administration and technical support"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Technical Support Dashboard</h2>
          <p className="text-cyan-100">
            Monitor system health, manage technical support, and ensure optimal performance of the PM-AJAY digital infrastructure.
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
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                System Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{service.service}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${service.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                          service.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {service.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Uptime</p>
                        <p className="font-medium">{service.uptime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Response Time</p>
                        <p className="font-medium">{service.responseTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View System Details</Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-orange-600" />
                Active Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                        <p className="text-sm text-gray-600">#{ticket.id} • {ticket.reportedBy}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">{ticket.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Assigned To</p>
                        <p className="font-medium">{ticket.assignedTo}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Created: {ticket.createdDate} • ETA: {ticket.estimatedResolution}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Tickets</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and User Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric.metric}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{metric.current}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          metric.trend === 'good' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Target: {metric.target}</div>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">Excellent</div>
                    <p className="text-xs text-gray-600">Overall Performance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                User Activity by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userActivity.map((role, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{role.role}</h4>
                      <span className="text-sm font-medium">{role.loginRate}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Active: {role.activeUsers}</span>
                      <span>Total: {role.totalUsers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full" 
                        style={{ width: role.loginRate }}
                      ></div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Detailed User Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${alert.type === 'Critical' ? 'bg-red-100 text-red-800' :
                          alert.type === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {alert.type}
                      </span>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-600">Action: {alert.action}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Alert History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Scheduled Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((maintenance, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{maintenance.task}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${maintenance.impact === 'High' ? 'bg-red-100 text-red-800' :
                          maintenance.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          maintenance.impact === 'Low' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'}`}>
                        {maintenance.impact} Impact
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{maintenance.scheduled}</p>
                      <p>Duration: {maintenance.duration}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Schedule Maintenance</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities and Quick Actions */}
          <div className="space-y-6">
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
                        ${activity.type === 'maintenance' ? 'bg-blue-500' :
                          activity.type === 'user' ? 'bg-green-500' :
                          activity.type === 'performance' ? 'bg-purple-500' :
                          'bg-red-500'}`}>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                        <p className="text-xs text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
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
                  <Button className="h-12 flex-col">
                    <Settings className="w-4 h-4 mb-1" />
                    System Config
                  </Button>
                  <Button variant="outline" className="h-12 flex-col">
                    <Database className="w-4 h-4 mb-1" />
                    DB Admin
                  </Button>
                  <Button variant="outline" className="h-12 flex-col">
                    <Code className="w-4 h-4 mb-1" />
                    Deploy Code
                  </Button>
                  <Button variant="outline" className="h-12 flex-col">
                    <FileText className="w-4 h-4 mb-1" />
                    System Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TechnicalSupportDashboard;