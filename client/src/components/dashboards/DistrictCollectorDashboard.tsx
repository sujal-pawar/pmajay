import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusColor } from '../../lib/permissions';
import { 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  MapPin,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  AlertCircle,
  Target
} from 'lucide-react';
import { 
  projectsApi, 
  milestonesApi, 
  beneficiariesApi, 
  progressApi,
  fundsApi 
} from '../../services/api';

interface Project {
  _id: string;
  projectName: string;
  status: string;
  priority?: string;
  location: {
    state: string;
    district: string;
    block?: string;
    village?: string;
  };
  financials: {
    sanctionedAmount: number;
    releasedAmount: number;
    utilizedAmount: number;
  };
  schemeType: string;
  startDate: string;
  endDate: string;
  approvals?: {
    districtApprovalStatus: string;
    stateApprovalStatus: string;
    collectorApprovalDate?: string;
    screeningStatus?: string;
  };
  applicationDate?: string;
  lastFieldVisit?: string;
  nextDeadline?: string;
}

interface FieldVisit {
  _id: string;
  projectId: string;
  visitDate: string;
  officer: string;
  findings: string;
  status: string;
  recommendations: string[];
}

const DistrictCollectorDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingScreening, setPendingScreening] = useState<Project[]>([]);
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingScreening: 0,
    approved: 0,
    underReview: 0,
    fieldVisitsCompleted: 0,
    upcomingDeadlines: 0,
    priorityProjects: 0,
    totalBudgetAllocated: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('screening');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const districtFilter = user?.jurisdiction?.district;
      const stateFilter = user?.jurisdiction?.state;
      
      // Fetch all projects for the district
      const response = await projectsApi.getAll({ 
        limit: 100, 
        state: stateFilter,
        district: districtFilter 
      }, token || undefined);
      
      const projectsData = response?.data?.projects || response?.data || [];
      const safeProjects = Array.isArray(projectsData) ? projectsData : [];
      
      setProjects(safeProjects);
      
      // Filter projects by screening status
      const pendingScreeningProjects = safeProjects.filter((project: Project) => 
        project.approvals?.screeningStatus === 'Pending' || 
        project.approvals?.districtApprovalStatus === 'Pending'
      );
      setPendingScreening(pendingScreeningProjects);
      
      // Mock field visits data (in real app, this would come from API)
      const mockFieldVisits: FieldVisit[] = [
        {
          _id: '1',
          projectId: safeProjects[0]?._id || '1',
          visitDate: '2024-12-15',
          officer: 'Field Officer A',
          findings: 'Infrastructure development on track',
          status: 'Completed',
          recommendations: ['Continue as planned', 'Increase monitoring frequency']
        }
      ];
      setFieldVisits(mockFieldVisits);
      
      // Mock upcoming deadlines
      const mockDeadlines = safeProjects.map((project: Project) => ({
        ...project,
        deadlineType: 'Screening Deadline',
        daysRemaining: Math.floor(Math.random() * 30) + 1,
        urgency: Math.random() > 0.5 ? 'High' : 'Medium'
      })).slice(0, 5);
      setUpcomingDeadlines(mockDeadlines);
      
      // Calculate statistics
      const totalApplications = safeProjects.length;
      const pendingScreeningCount = pendingScreeningProjects.length;
      const approved = safeProjects.filter((p: Project) => p.approvals?.districtApprovalStatus === 'Approved').length;
      const underReview = safeProjects.filter((p: Project) => p.status === 'Under Review').length;
      const priorityProjects = safeProjects.filter((p: Project) => p.priority === 'High').length;
      const totalBudgetAllocated = safeProjects.reduce((sum: number, p: Project) => sum + (p.financials?.sanctionedAmount || 0), 0);
      
      setStats({
        totalApplications,
        pendingScreening: pendingScreeningCount,
        approved,
        underReview,
        fieldVisitsCompleted: mockFieldVisits.length,
        upcomingDeadlines: mockDeadlines.length,
        priorityProjects,
        totalBudgetAllocated
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenProject = (projectId: string, action: 'approve' | 'reject') => {
    // Implementation for screening approval/rejection
    console.log(`${action} project ${projectId}`);
  };

  const handleScheduleFieldVisit = (projectId: string) => {
    // Implementation for scheduling field visits
    console.log(`Schedule field visit for project ${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading District Collector Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">District Collector Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Project Applications, Screening & Monitoring - {user?.jurisdiction?.district}, {user?.jurisdiction?.state}
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Screening</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingScreening}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Projects</p>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Priority Projects</p>
                  <p className="text-3xl font-bold text-red-600">{stats.priorityProjects}</p>
                </div>
                <Target className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="screening">Project Screening</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="field-visits">Field Visits</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Project Screening Tab */}
          <TabsContent value="screening" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Project Applications Screening
                </CardTitle>
                <CardDescription>Review and approve/reject project applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pendingScreening || []).map((project) => (
                    <div key={project._id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{project.projectName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {project.location?.village}, {project.location?.block}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied: {new Date(project.applicationDate || project.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Pending Screening</Badge>
                          {project.priority === 'High' && (
                            <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Scheme Type</p>
                          <p className="font-medium">{project.schemeType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sanctioned Amount</p>
                          <p className="font-medium">₹{project.financials?.sanctionedAmount?.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleScreenProject(project._id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleScreenProject(project._id, 'reject')}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleScheduleFieldVisit(project._id)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Visit
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingScreening.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No pending applications for screening</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Project Monitoring
                </CardTitle>
                <CardDescription>Track progress of approved projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(projects || [])
                    .filter(project => project.approvals?.districtApprovalStatus === 'Approved')
                    .map((project) => (
                    <div key={project._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <p className="text-sm text-gray-600">{project.location?.village}, {project.location?.block}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Project Progress</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Budget Utilization</p>
                          <p className="font-medium">
                            ₹{project.financials?.utilizedAmount?.toLocaleString()} / 
                            ₹{project.financials?.sanctionedAmount?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Visit</p>
                          <p className="font-medium">{project.lastFieldVisit || 'Not scheduled'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Next Milestone</p>
                          <p className="font-medium">{project.nextDeadline || 'TBD'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Field Visits Tab */}
          <TabsContent value="field-visits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Field Visit Reports
                </CardTitle>
                <CardDescription>Review field visit findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fieldVisits.map((visit) => {
                    const project = projects.find(p => p._id === visit.projectId);
                    return (
                      <div key={visit._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{project?.projectName}</h3>
                            <p className="text-sm text-gray-600">Visit Date: {new Date(visit.visitDate).toLocaleDateString()}</p>
                          </div>
                          <Badge className={getStatusColor(visit.status)}>
                            {visit.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Findings:</p>
                          <p className="text-sm text-gray-600">{visit.findings}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {visit.recommendations.map((rec, index) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deadlines Tab */}
          <TabsContent value="deadlines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Critical deadlines requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline._id} className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{deadline.projectName}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={deadline.urgency === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {deadline.urgency} Priority
                          </Badge>
                          <Badge variant="outline">
                            {deadline.daysRemaining} days left
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{deadline.deadlineType}</p>
                      <p className="text-sm text-gray-600">{deadline.location?.village}, {deadline.location?.block}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  District Reports
                </CardTitle>
                <CardDescription>Generate and download district-level reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Project Status Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Field Visit Summary
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Budget Utilization
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Screening Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DistrictCollectorDashboard;