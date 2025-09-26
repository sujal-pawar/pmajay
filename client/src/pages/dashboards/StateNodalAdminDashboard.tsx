import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Clock,
  Eye
} from 'lucide-react';

const StateNodalAdminDashboard = () => {
  const navItems = [
    { label: 'State Overview', icon: <BarChart3 className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'District Monitoring', icon: <MapPin className="w-4 h-4" />, path: '/districts' },
    { label: 'Policy Compliance', icon: <Shield className="w-4 h-4" />, path: '/compliance' },
    { label: 'Performance Analytics', icon: <TrendingUp className="w-4 h-4" />, path: '/analytics' },
    { label: 'Resource Management', icon: <Users className="w-4 h-4" />, path: '/resources' },
    { label: 'Reports & Documentation', icon: <FileText className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'Districts Covered', value: '28', icon: <MapPin className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Total Beneficiaries', value: '125K', icon: <Users className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'State Fund Utilization', value: '₹450Cr', icon: <TrendingUp className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Compliance Score', value: '92%', icon: <Shield className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const districtPerformance = [
    { name: 'Pune', beneficiaries: 8500, progress: 94, funding: '₹24.5Cr', status: 'Excellent' },
    { name: 'Mumbai', beneficiaries: 12000, progress: 89, funding: '₹32.1Cr', status: 'Good' },
    { name: 'Nashik', beneficiaries: 6200, progress: 87, funding: '₹18.7Cr', status: 'Good' },
    { name: 'Nagpur', beneficiaries: 7800, progress: 91, funding: '₹22.3Cr', status: 'Excellent' },
    { name: 'Aurangabad', beneficiaries: 5400, progress: 76, funding: '₹16.2Cr', status: 'Needs Attention' },
  ];

  const complianceMetrics = [
    { metric: 'Policy Adherence', score: 95, target: 90, status: 'Exceeds' },
    { metric: 'Financial Compliance', score: 92, target: 85, status: 'Exceeds' },
    { metric: 'Documentation Quality', score: 88, target: 90, status: 'Below' },
    { metric: 'Reporting Timeliness', score: 94, target: 95, status: 'Below' },
  ];

  const recentAlerts = [
    { 
      district: 'Aurangabad', 
      alert: 'Below target performance in Q3', 
      severity: 'Medium', 
      time: '2 hours ago' 
    },
    { 
      district: 'Kolhapur', 
      alert: 'Delayed monthly reporting', 
      severity: 'High', 
      time: '1 day ago' 
    },
    { 
      district: 'Solapur', 
      alert: 'Budget variance exceeding 10%', 
      severity: 'Low', 
      time: '2 days ago' 
    },
  ];

  const keyMetrics = [
    { label: 'Active Districts', value: '28/28', percentage: 100 },
    { label: 'Implementation Rate', value: '89.2%', percentage: 89 },
    { label: 'Budget Utilization', value: '87.5%', percentage: 88 },
    { label: 'Quality Score', value: '4.6/5', percentage: 92 },
  ];

  return (
    <DashboardLayout
      title="State Nodal Admin"
      subtitle="State-level oversight and coordination"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">State Administration Dashboard</h2>
          <p className="text-purple-100">
            Monitor state-wide PM-AJAY implementation, oversee district performance, and ensure policy compliance across all regions.
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
          {/* District Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Top District Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {districtPerformance.map((district, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{district.name}</h4>
                        <p className="text-sm text-gray-600">{district.beneficiaries.toLocaleString()} beneficiaries</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${district.status === 'Excellent' ? 'bg-green-100 text-green-800' :
                          district.status === 'Good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {district.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{district.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${district.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Funding</span>
                        <span className="font-medium">{district.funding}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View All Districts</Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Policy Compliance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{item.metric}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{item.score}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${item.status === 'Exceeds' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.status === 'Exceeds' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">Target: {item.target}%</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Detailed Compliance Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Performance Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Key Performance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span className="text-sm font-medium">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">A+</div>
                    <p className="text-sm text-gray-600">Overall State Rating</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Budget Allocation & Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-700">Total State Allocation</div>
                  <div className="text-xl font-bold text-green-900">₹515 Crores</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">Utilized Amount</div>
                  <div className="text-xl font-bold text-blue-900">₹450 Crores</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-orange-700">Remaining</div>
                  <div className="text-xl font-bold text-orange-900">₹65 Crores</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization Rate</span>
                    <span>87.4%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '87.4%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Recent Alerts & Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.district}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{alert.alert}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Immediate Action Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Immediate Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Critical Review Required</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">Kolhapur district reporting delay - requires immediate attention</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Central Report Due</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">Quarterly state summary report due to central admin tomorrow</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Policy Review</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">3 districts require policy compliance review this week</p>
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
                  Generate State Report
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <MapPin className="w-5 h-5 mb-1" />
                  District Analysis
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Shield className="w-5 h-5 mb-1" />
                  Compliance Check
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <BarChart3 className="w-5 h-5 mb-1" />
                  Performance Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StateNodalAdminDashboard;