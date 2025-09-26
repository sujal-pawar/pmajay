import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, 
  Users, 
  TrendingUp, 
  FileSearch, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  BarChart3,
  Target
} from 'lucide-react';

const DistrictPACCAdminDashboard = () => {
  const navItems = [
    { label: 'PACC Overview', icon: <BarChart3 className="w-4 h-4" />, path: '/dashboard', active: true },
    { label: 'Application Reviews', icon: <ClipboardCheck className="w-4 h-4" />, path: '/reviews' },
    { label: 'Beneficiary Verification', icon: <Users className="w-4 h-4" />, path: '/verification' },
    { label: 'Audit & Compliance', icon: <FileSearch className="w-4 h-4" />, path: '/audit' },
    { label: 'Performance Monitoring', icon: <TrendingUp className="w-4 h-4" />, path: '/monitoring' },
    { label: 'Committee Reports', icon: <Eye className="w-4 h-4" />, path: '/reports' },
  ];

  const stats = [
    { title: 'Pending Reviews', value: '156', icon: <ClipboardCheck className="w-6 h-6" />, color: 'text-blue-600' },
    { title: 'Verified Beneficiaries', value: '2,847', icon: <Users className="w-6 h-6" />, color: 'text-green-600' },
    { title: 'Audit Score', value: '94%', icon: <FileSearch className="w-6 h-6" />, color: 'text-purple-600' },
    { title: 'Committee Efficiency', value: '89%', icon: <Target className="w-6 h-6" />, color: 'text-orange-600' },
  ];

  const applicationQueue = [
    { 
      id: 'APP-2025-001', 
      applicant: 'Rajesh Kumar', 
      scheme: 'Education Support', 
      priority: 'High', 
      submitted: '2 days ago',
      status: 'Under Review'
    },
    { 
      id: 'APP-2025-002', 
      applicant: 'Sunita Devi', 
      scheme: 'Healthcare Access', 
      priority: 'Medium', 
      submitted: '3 days ago',
      status: 'Verification Pending'
    },
    { 
      id: 'APP-2025-003', 
      applicant: 'Mukesh Singh', 
      scheme: 'Skill Development', 
      priority: 'High', 
      submitted: '1 day ago',
      status: 'Document Review'
    },
    { 
      id: 'APP-2025-004', 
      applicant: 'Priya Sharma', 
      scheme: 'Housing Assistance', 
      priority: 'Low', 
      submitted: '4 days ago',
      status: 'Committee Review'
    },
  ];

  const verificationMetrics = [
    { metric: 'Document Authenticity', score: 96, processed: 245, target: 95 },
    { metric: 'Eligibility Criteria', score: 92, processed: 189, target: 90 },
    { metric: 'Income Verification', score: 88, processed: 203, target: 85 },
    { metric: 'Community Validation', score: 94, processed: 167, target: 90 },
  ];

  const committeeMeetings = [
    { date: 'Today, 2:00 PM', agenda: 'Review 25 housing applications', attendees: 7, status: 'Scheduled' },
    { date: 'Tomorrow, 10:00 AM', agenda: 'Audit findings discussion', attendees: 5, status: 'Scheduled' },
    { date: 'Jan 25, 3:00 PM', agenda: 'Monthly performance review', attendees: 9, status: 'Upcoming' },
    { date: 'Jan 28, 11:00 AM', agenda: 'Policy compliance meeting', attendees: 6, status: 'Upcoming' },
  ];

  const recentDecisions = [
    { application: 'APP-2025-156', decision: 'Approved', scheme: 'Education Support', time: '1 hour ago' },
    { application: 'APP-2025-155', decision: 'Rejected', scheme: 'Healthcare Access', time: '3 hours ago' },
    { application: 'APP-2025-154', decision: 'Approved', scheme: 'Skill Development', time: '5 hours ago' },
    { application: 'APP-2025-153', decision: 'Revision Required', scheme: 'Housing Assistance', time: '1 day ago' },
  ];

  const auditAlerts = [
    { 
      type: 'Document Discrepancy', 
      severity: 'Medium', 
      description: '3 applications have income certificate inconsistencies',
      time: '2 hours ago'
    },
    { 
      type: 'Processing Delay', 
      severity: 'High', 
      description: '15 applications exceeding standard review time',
      time: '1 day ago'
    },
    { 
      type: 'Committee Quorum', 
      severity: 'Low', 
      description: 'Next meeting requires 2 more committee members',
      time: '2 days ago'
    },
  ];

  return (
    <DashboardLayout
      title="District PACC Admin"
      subtitle="Project Approval & Community Committee oversight"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">PACC Administration Dashboard</h2>
          <p className="text-teal-100">
            Manage Project Approval and Community Committee operations, oversee beneficiary verification, and ensure transparent decision-making processes.
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
          {/* Application Review Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
                Application Review Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationQueue.map((app, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{app.id}</h4>
                        <p className="text-sm text-gray-600">{app.applicant} • {app.scheme}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${app.priority === 'High' ? 'bg-red-100 text-red-800' :
                          app.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {app.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Submitted {app.submitted}</span>
                      <span className="font-medium text-blue-600">{app.status}</span>
                    </div>
                  </div>
                ))}
                <Button className="w-full">Process Applications</Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSearch className="w-5 h-5 mr-2 text-green-600" />
                Verification Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationMetrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{metric.score}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${metric.score >= metric.target ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {metric.score >= metric.target ? 'Target Met' : 'Below Target'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${metric.score >= metric.target ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${metric.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">Target: {metric.target}%</span>
                    </div>
                    <p className="text-xs text-gray-600">Processed: {metric.processed} cases</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Detailed Verification Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Committee and Decisions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Committee Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Committee Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {committeeMeetings.map((meeting, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{meeting.date}</h4>
                        <p className="text-sm text-gray-600">{meeting.agenda}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${meeting.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Attendees: {meeting.attendees} members</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Schedule New Meeting</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Decisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-orange-600" />
                Recent Committee Decisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDecisions.map((decision, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{decision.application}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium
                          ${decision.decision === 'Approved' ? 'bg-green-100 text-green-800' :
                            decision.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {decision.decision}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{decision.scheme} • {decision.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View Decision History</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audit Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Audit Alerts & Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditAlerts.map((alert, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900 text-sm">{alert.type}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{alert.description}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Audit Reports
                </Button>
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
                  <ClipboardCheck className="w-5 h-5 mb-1" />
                  Review Applications
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Users className="w-5 h-5 mb-1" />
                  Verify Beneficiaries
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <Clock className="w-5 h-5 mb-1" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="h-16 flex-col">
                  <FileSearch className="w-5 h-5 mb-1" />
                  Generate Audit Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistrictPACCAdminDashboard;