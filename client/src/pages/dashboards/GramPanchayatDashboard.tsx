import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  FileText, 
  MapPin,
  Activity,
  Camera,
  Upload
} from 'lucide-react';

const GramPanchayatDashboard = () => {
  const navItems = [
    { label: 'Village Overview', icon: <Activity className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Beneficiary Verification', icon: <Users className="w-4 h-4" />, path: '/beneficiaries' },
    { label: 'Local Projects', icon: <MapPin className="w-4 h-4" />, path: '/projects' },
    { label: 'Progress Reports', icon: <FileText className="w-4 h-4" />, path: '/reports' },
    { label: 'Document Upload', icon: <Upload className="w-4 h-4" />, path: '/upload' },
    { label: 'Field Photos', icon: <Camera className="w-4 h-4" />, path: '/photos' },
  ];

  const stats = [
    { title: 'Village Projects', value: '3', icon: <MapPin className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Beneficiaries Verified', value: '125', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Pending Verifications', value: '8', icon: <Clock className="w-6 h-6" />, color: 'text-orange-600' },
    { title: 'Reports Submitted', value: '12', icon: <FileText className="w-6 h-6" />, color: 'text-purple-600' },
  ];

  const recentProjects = [
    { name: 'Community Center Construction', status: 'In Progress', progress: 65, funds: '₹15L' },
    { name: 'School Building Renovation', status: 'Completed', progress: 100, funds: '₹8L' },
    { name: 'Water Supply Infrastructure', status: 'Planning', progress: 25, funds: '₹12L' },
  ];

  const pendingVerifications = [
    { name: 'Rajesh Kumar', category: 'SC', document: 'Income Certificate', submitted: '2 days ago' },
    { name: 'Sunita Devi', category: 'SC', document: 'Caste Certificate', submitted: '1 day ago' },
    { name: 'Mohan Singh', category: 'SC', document: 'Residence Proof', submitted: '3 hours ago' },
  ];

  return (
    <DashboardLayout
      title="Gram Panchayat User"
      subtitle="Village-level program implementation"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Village Dashboard</h2>
          <p className="text-green-100">
            Manage local PM-AJAY implementation, verify beneficiaries, and track project progress in your village.
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
          {/* Local Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Local Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Budget: {project.funds}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View All Projects</Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Verifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Pending Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.document} • {item.submitted}</p>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                        {item.category}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Button size="sm" className="w-full">Verify</Button>
                      <Button size="sm" variant="outline" className="w-full text-xs">Reject</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Pending</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Beneficiary verified</p>
                    <p className="text-gray-500">Ramesh Kumar - SC category - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Progress report submitted</p>
                    <p className="text-gray-500">Community Center project - 1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Document uploaded</p>
                    <p className="text-gray-500">Site photos for water project - 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Meeting attended</p>
                    <p className="text-gray-500">District coordination meeting - 3 days ago</p>
                  </div>
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
                <Button className="h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Verify Beneficiary
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Submit Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Camera className="w-6 h-6 mb-2" />
                  Upload Photos
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MapPin className="w-6 h-6 mb-2" />
                  Update Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Monthly Report Due</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Your monthly progress report is due by the end of this week. Please ensure all project updates and beneficiary verifications are completed.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Start Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GramPanchayatDashboard;