import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';

const StateSCCorporationAdminDashboard = () => {
  const navItems = [
    { label: 'Corporation Overview', icon: <Award className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'SC Beneficiary Management', icon: <Users className="w-4 h-4" />, path: '/beneficiaries' },
    { label: 'Scheme Implementation', icon: <Target className="w-4 h-4" />, path: '/schemes' },
    { label: 'Community Programs', icon: <BookOpen className="w-4 h-4" />, path: '/programs' },
    { label: 'Financial Oversight', icon: <Shield className="w-4 h-4" />, path: '/finance' },
    { label: 'Reports & Analytics', icon: <FileText className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'SC Beneficiaries', value: '45,200', icon: <Users className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Active Schemes', value: '18', icon: <Target className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Funds Allocated', value: '₹125Cr', icon: <TrendingUp className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Coverage Rate', value: '89.2%', icon: <CheckCircle className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const schemePerformance = [
    { 
      name: 'Education Support Scheme', 
      beneficiaries: 8500, 
      allocated: '₹24.5Cr', 
      utilized: 92, 
      status: 'Excellent',
      target: 9000 
    },
    { 
      name: 'Skill Development Program', 
      beneficiaries: 6200, 
      allocated: '₹18.3Cr', 
      utilized: 87, 
      status: 'Good',
      target: 7000 
    },
    { 
      name: 'Healthcare Access Initiative', 
      beneficiaries: 12000, 
      allocated: '₹32.7Cr', 
      utilized: 94, 
      status: 'Excellent',
      target: 12500 
    },
    { 
      name: 'Housing Assistance Scheme', 
      beneficiaries: 3400, 
      allocated: '₹45.2Cr', 
      utilized: 78, 
      status: 'Needs Attention',
      target: 4000 
    },
  ];

  const communityPrograms = [
    { program: 'Digital Literacy Training', participants: 2400, completion: 85, duration: '3 months' },
    { program: 'Women Empowerment Workshops', participants: 1800, completion: 92, duration: '2 months' },
    { program: 'Youth Leadership Development', participants: 950, completion: 78, duration: '6 months' },
    { program: 'Health Awareness Campaigns', participants: 5200, completion: 96, duration: '1 month' },
  ];

  const recentActivities = [
    { activity: 'Approved 150 new education applications', time: '2 hours ago', type: 'approval' },
    { activity: 'Conducted community outreach program', time: '1 day ago', type: 'outreach' },
    { activity: 'Released quarterly performance report', time: '2 days ago', type: 'report' },
    { activity: 'Distributed skill training certificates', time: '3 days ago', type: 'distribution' },
  ];

  const upcomingEvents = [
    { event: 'State SC Corporation Board Meeting', date: 'Jan 25, 2025', priority: 'High' },
    { event: 'Community Leaders Conference', date: 'Feb 2, 2025', priority: 'Medium' },
    { event: 'Scheme Review Committee Meeting', date: 'Feb 8, 2025', priority: 'High' },
    { event: 'Annual Achievement Awards Ceremony', date: 'Feb 15, 2025', priority: 'Medium' },
  ];

  return (
    <DashboardLayout
      title="State SC Corporation Admin"
      subtitle="SC community development and scheme management"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">SC Corporation Dashboard</h2>
          <p className="text-indigo-100">
            Monitor and manage Scheduled Caste community development programs, track beneficiary services, and ensure inclusive implementation of PM-AJAY initiatives.
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
          {/* Scheme Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Scheme Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schemePerformance.map((scheme, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                        <p className="text-sm text-gray-600">{scheme.beneficiaries.toLocaleString()} / {scheme.target.toLocaleString()} beneficiaries</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${scheme.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                          scheme.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {scheme.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fund Utilization</span>
                        <span>{scheme.utilized}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${scheme.utilized}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Allocated</span>
                        <span className="font-medium">{scheme.allocated}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View Detailed Scheme Reports</Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                Community Programs Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityPrograms.map((program, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{program.program}</h4>
                      <span className="text-sm text-gray-600">{program.duration}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participants: {program.participants.toLocaleString()}</span>
                        <span>Completion: {program.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            program.completion >= 90 ? 'bg-green-500' :
                            program.completion >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${program.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Launch New Program</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Beneficiary Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Beneficiary Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89.2%</div>
                  <p className="text-sm text-gray-600">Overall Coverage Rate</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Education Schemes</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Skill Development</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Healthcare Access</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <span className="text-sm font-medium">96%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Housing Assistance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2
                      ${activity.type === 'approval' ? 'bg-green-500' :
                        activity.type === 'outreach' ? 'bg-blue-500' :
                        activity.type === 'report' ? 'bg-purple-500' :
                        'bg-orange-500'}`}>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Full Activity Log
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-orange-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.event}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${event.priority === 'High' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {event.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Important Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Important Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Housing Scheme Underperformance</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">Housing assistance scheme at 78% utilization - needs attention</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Quarterly Report Due</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">SC corporation quarterly report submission due in 3 days</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">New Applications Available</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">75 new beneficiary applications ready for review</p>
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
                  <Users className="w-5 h-5 mb-1" />
                  Review Applications
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <FileText className="w-5 h-5 mb-1" />
                  Generate Report
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <BookOpen className="w-5 h-5 mb-1" />
                  Launch Program
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Award className="w-5 h-5 mb-1" />
                  Community Outreach
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StateSCCorporationAdminDashboard;