import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Search, 
  TrendingUp, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  BarChart3,
  Users
} from 'lucide-react';

const AuditorOversightDashboard = () => {
  const navItems = [
    { label: 'Audit Overview', icon: <Shield className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Active Audits', icon: <Search className="w-4 h-4" />, path: '/audits' },
    { label: 'Compliance Monitoring', icon: <Eye className="w-4 h-4" />, path: '/compliance' },
    { label: 'Risk Assessment', icon: <AlertTriangle className="w-4 h-4" />, path: '/risk' },
    { label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" />, path: '/analytics' },
    { label: 'Audit Trail', icon: <FileText className="w-4 h-4" />, path: '/trail' },
  ];

  const stats = [
    { title: 'Active Audits', value: '23', icon: <Search className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Completed This Month', value: '45', icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Compliance Rate', value: '94.2%', icon: <Shield className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Critical Issues', value: '3', icon: <AlertTriangle className="w-6 h-6" />, color: 'text-red-600' },
  ];

  const activeAudits = [
    { 
      project: 'District Infrastructure Development',
      type: 'Financial Audit',
      auditor: 'Senior Auditor Team A',
      progress: 75,
      startDate: '2025-09-15',
      expectedCompletion: '2025-10-15',
      riskLevel: 'Medium',
      findings: 2
    },
    { 
      project: 'Rural Healthcare Program',
      type: 'Performance Audit',
      auditor: 'Audit Team B',
      progress: 45,
      startDate: '2025-09-20',
      expectedCompletion: '2025-10-25',
      riskLevel: 'Low',
      findings: 0
    },
    { 
      project: 'Education Support Scheme',
      type: 'Compliance Audit',
      auditor: 'External Audit Firm',
      progress: 90,
      startDate: '2025-09-10',
      expectedCompletion: '2025-10-05',
      riskLevel: 'High',
      findings: 4
    },
  ];

  const complianceMetrics = [
    { area: 'Financial Management', score: 96, trend: 'up', lastAudit: '2 weeks ago' },
    { area: 'Project Implementation', score: 92, trend: 'stable', lastAudit: '1 week ago' },
    { area: 'Documentation Standards', score: 89, trend: 'down', lastAudit: '3 days ago' },
    { area: 'Beneficiary Services', score: 94, trend: 'up', lastAudit: '1 week ago' },
    { area: 'Resource Utilization', score: 91, trend: 'up', lastAudit: '5 days ago' },
  ];

  const criticalFindings = [
    { 
      project: 'Infrastructure Development Phase II',
      finding: 'Budget variance exceeding 15% threshold',
      severity: 'High',
      status: 'Under Review',
      assignedTo: 'Financial Audit Team',
      reportedDate: '2025-09-22'
    },
    { 
      project: 'Skills Training Centers',
      finding: 'Incomplete beneficiary documentation',
      severity: 'Medium',
      status: 'Action Taken',
      assignedTo: 'Compliance Team',
      reportedDate: '2025-09-20'
    },
    { 
      project: 'Community Health Program',
      finding: 'Delayed reporting to state nodal agency',
      severity: 'Low',
      status: 'Resolved',
      assignedTo: 'Process Audit Team',
      reportedDate: '2025-09-18'
    },
  ];

  const upcomingAudits = [
    { project: 'Housing Development Scheme', type: 'Social Audit', date: '2025-10-08', priority: 'High' },
    { project: 'Water Supply Infrastructure', type: 'Technical Audit', date: '2025-10-12', priority: 'Medium' },
    { project: 'Digital Governance Initiative', type: 'IT Audit', date: '2025-10-18', priority: 'High' },
    { project: 'Youth Employment Program', type: 'Financial Audit', date: '2025-10-25', priority: 'Low' },
  ];

  const auditTeamPerformance = [
    { team: 'Senior Audit Team A', auditsCompleted: 12, avgDuration: 18, qualityScore: 4.8 },
    { team: 'Audit Team B', auditsCompleted: 8, avgDuration: 22, qualityScore: 4.6 },
    { team: 'External Audit Firm', auditsCompleted: 15, avgDuration: 16, qualityScore: 4.9 },
    { team: 'Compliance Team', auditsCompleted: 10, avgDuration: 14, qualityScore: 4.7 },
  ];

  const riskAssessment = [
    { category: 'Financial Risk', level: 'Low', score: 2.1, indicators: ['Budget adherence', 'Payment delays'] },
    { category: 'Operational Risk', level: 'Medium', score: 3.5, indicators: ['Resource constraints', 'Timeline delays'] },
    { category: 'Compliance Risk', level: 'Low', score: 1.8, indicators: ['Policy adherence', 'Documentation'] },
    { category: 'Reputational Risk', level: 'Low', score: 2.3, indicators: ['Public satisfaction', 'Media coverage'] },
  ];

  return (
    <DashboardLayout
      title="Auditor/Oversight"
      subtitle="Independent audit and oversight functions"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">Audit & Oversight Dashboard</h2>
          <p className="text-gray-300">
            Ensure transparency, accountability, and compliance in PM-AJAY implementation through comprehensive auditing and oversight functions.
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
          {/* Active Audits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Active Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAudits.map((audit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{audit.project}</h4>
                        <p className="text-sm text-gray-600">{audit.type} • {audit.auditor}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${audit.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          audit.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {audit.riskLevel} Risk
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{audit.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${audit.progress}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div>
                          <p className="text-gray-600">Expected Completion</p>
                          <p className="font-medium">{audit.expectedCompletion}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Findings</p>
                          <p className="font-medium">{audit.findings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full">View All Active Audits</Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Compliance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{metric.area}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{metric.score}%</span>
                        <div className={`w-3 h-3 rounded-full
                          ${metric.trend === 'up' ? 'bg-green-500' :
                            metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'}`}>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${metric.score >= 90 ? 'bg-green-500' : 
                          metric.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">Last audit: {metric.lastAudit}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Generate Compliance Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment and Findings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessment.map((risk, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{risk.category}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${risk.level === 'High' ? 'bg-red-100 text-red-800' :
                          risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {risk.level}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{risk.score}/5</div>
                    <div className="text-xs text-gray-600">
                      Key indicators: {risk.indicators.join(', ')}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Detailed Risk Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Critical Findings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Critical Findings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalFindings.map((finding, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{finding.project}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${finding.severity === 'High' ? 'bg-red-100 text-red-800' :
                          finding.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {finding.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{finding.finding}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Status: {finding.status}</span>
                      <span>{finding.reportedDate}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Assigned: {finding.assignedTo}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Findings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Audits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAudits.map((audit, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{audit.project}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${audit.priority === 'High' ? 'bg-red-100 text-red-800' :
                          audit.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                        {audit.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{audit.type}</p>
                    <p className="text-xs text-gray-500">{audit.date}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Schedule New Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Performance and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audit Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Audit Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTeamPerformance.map((team, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{team.team}</h4>
                      <span className="text-sm font-bold text-green-600">{team.qualityScore}/5</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Completed</p>
                        <p className="font-medium">{team.auditsCompleted}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Duration</p>
                        <p className="font-medium">{team.avgDuration} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Quality Score</p>
                        <p className="font-medium">{team.qualityScore}/5</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View Team Analytics</Button>
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
                  <Search className="w-5 h-5 mb-1" />
                  Initiate Audit
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <FileText className="w-5 h-5 mb-1" />
                  Generate Report
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Shield className="w-5 h-5 mb-1" />
                  Compliance Check
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <BarChart3 className="w-5 h-5 mb-1" />
                  Risk Analysis
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">System Alert</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">3 audits require immediate attention - review priority queue</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditorOversightDashboard;