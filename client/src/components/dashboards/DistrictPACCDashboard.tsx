import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusColor } from '../../lib/permissions';
import { 
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  Star,
  BookOpen,
  Download,
  Eye,
  Edit,
  Send,
  Building,
  Users,
  MapPin,
  Calendar,
  MessageCircle
} from 'lucide-react';
import MessagingComponent from '../MessagingComponent';
import { useSocket } from '../../contexts/SocketContext';
import { 
  projectsApi, 
  milestonesApi, 
  beneficiariesApi, 
  progressApi 
} from '../../services/api';

interface ProjectAppraisal {
  _id: string;
  projectId: string;
  projectName: string;
  status: string;
  technicalScore: number;
  financialScore: number;
  socialScore: number;
  overallScore: number;
  feasibilityStatus: string;
  convergenceOpportunities: string[];
  recommendations: string[];
  appraisalDate: string;
  appraiser: string;
  riskLevel: string;
}

interface Project {
  _id: string;
  projectId: string;
  projectName: string;
  projectDescription: string;
  status: string;
  location: {
    state: string;
    district: string;
    block?: string;
    village?: string;
  };
  financials: {
    estimatedCost: number;
    sanctionedAmount: number;
    totalReleased: number;
    totalUtilized: number;
  };
  schemeType: string;
  timeline: {
    startDate: string;
    scheduledEndDate: string;
  };
  priority: string;
  approvals?: {
    paccApprovalStatus: string;
    paccApprovalDate?: string;
    submittedForPACCOn?: string;
    submittedBy?: string;
    approvedBy?: string;
  };
  technicalDetails?: {
    complexity: string;
    duration: number;
    beneficiaryCount: number;
    projectType: string;
  };
  assignedAgencies?: {
    implementingAgency?: string;
    supervisingOfficer?: string;
  };
}

const DistrictPACCDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { unreadCount } = useSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [appraisals, setAppraisals] = useState<ProjectAppraisal[]>([]);
  const [pendingAppraisals, setPendingAppraisals] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingAppraisals: 0,
    completedAppraisals: 0,
    avgAppraisalScore: 0,
    highRiskProjects: 0,
    convergenceOpportunities: 0,
    approvedProjects: 0,
    rejectedProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appraisals');
  const [error, setError] = useState<string | null>(null);
  const [messagingOpen, setMessagingOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const districtFilter = user?.jurisdiction?.district;
      const stateFilter = user?.jurisdiction?.state;
      
      // Fetch projects pending PACC approval directly
      console.log('Fetching pending PACC approvals, token:', !!token);
      
      const [allProjectsResponse, pendingPACCResponse] = await Promise.all([
        // Get all projects for statistics
        projectsApi.getAll({ 
          limit: 100, 
          state: stateFilter,
          district: districtFilter 
        }, token || undefined),
        // Get pending PACC approvals specifically
        projectsApi.getPendingPACCApprovals({ limit: 100 }, token || undefined)
      ]);
      
      console.log('All Projects Response:', allProjectsResponse);
      console.log('Pending PACC Response:', pendingPACCResponse);
      
      // Handle paginated response from mongoose-paginate-v2
      const allProjectsData = allProjectsResponse?.data?.docs || allProjectsResponse?.data?.projects || allProjectsResponse?.data || [];
      const safeAllProjects = Array.isArray(allProjectsData) ? allProjectsData : [];
      
      const pendingProjectsData = pendingPACCResponse?.data?.docs || pendingPACCResponse?.data?.projects || pendingPACCResponse?.data || [];
      const safePendingProjects = Array.isArray(pendingProjectsData) ? pendingProjectsData : [];
      
      console.log('All projects:', safeAllProjects);
      console.log('All projects count:', safeAllProjects.length);
      console.log('Pending projects:', safePendingProjects);
      console.log('Pending projects count:', safePendingProjects.length);
      
      setProjects(safeAllProjects);
      setPendingAppraisals(safePendingProjects);
      
      // Mock appraisal data (in real app, this would come from API)
      const mockAppraisals: ProjectAppraisal[] = safeAllProjects.map((project, index) => ({
        _id: `appraisal_${project._id}`,
        projectId: project._id,
        projectName: project.projectName,
        status: index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'In Review' : 'Pending',
        technicalScore: Math.floor(Math.random() * 40) + 60, // 60-100
        financialScore: Math.floor(Math.random() * 30) + 70, // 70-100
        socialScore: Math.floor(Math.random() * 35) + 65, // 65-100
        overallScore: 0, // Will be calculated
        feasibilityStatus: Math.random() > 0.3 ? 'Feasible' : 'Needs Review',
        convergenceOpportunities: ['MGNREGA', 'Swachh Bharat', 'Rural Housing'].slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: [
          'Ensure proper environmental clearance',
          'Coordinate with local authorities',
          'Monitor implementation timeline'
        ],
        appraisalDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        appraiser: 'PACC Technical Team',
        riskLevel: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
      }));
      
      // Calculate overall scores
      mockAppraisals.forEach(appraisal => {
        appraisal.overallScore = Math.round((appraisal.technicalScore + appraisal.financialScore + appraisal.socialScore) / 3);
      });
      
      setAppraisals(mockAppraisals);
      
      // Calculate statistics
      const totalProjects = safeAllProjects.length;
      const pendingAppraisalsCount = safePendingProjects.length;
      const completedAppraisals = mockAppraisals.filter(a => a.status === 'Completed').length;
      const avgAppraisalScore = mockAppraisals.length > 0 
        ? Math.round(mockAppraisals.reduce((sum, a) => sum + a.overallScore, 0) / mockAppraisals.length)
        : 0;
      const highRiskProjects = mockAppraisals.filter(a => a.riskLevel === 'High').length;
      const convergenceOpportunities = mockAppraisals.reduce((sum, a) => sum + a.convergenceOpportunities.length, 0);
      const approvedProjects = safeAllProjects.filter((p: Project) => p.approvals?.paccApprovalStatus === 'Approved').length;
      const rejectedProjects = safeAllProjects.filter((p: Project) => p.approvals?.paccApprovalStatus === 'Rejected').length;
      
      setStats({
        totalProjects,
        pendingAppraisals: pendingAppraisalsCount,
        completedAppraisals,
        avgAppraisalScore,
        highRiskProjects,
        convergenceOpportunities,
        approvedProjects,
        rejectedProjects
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      const decisionData = {
        decision: 'Approved',
        comments: 'Project approved after technical evaluation',
        technicalScore: 85,
        financialScore: 78,
        socialScore: 82
      };

      await projectsApi.makePACCDecision(projectId, decisionData, token || undefined);
      
      // Refresh the dashboard data
      await fetchDashboardData();
      alert('Project approved successfully and forwarded to state level!');
    } catch (error) {
      console.error('Error approving project:', error);
      alert('Error approving project. Please try again.');
    }
  };

  const handleRejectProject = async (projectId: string) => {
    const reason = prompt('Please provide reason for rejection:');
    if (!reason) return;

    try {
      const decisionData = {
        decision: 'Rejected',
        comments: reason,
        technicalScore: 45,
        financialScore: 50,
        socialScore: 40
      };

      await projectsApi.makePACCDecision(projectId, decisionData, token || undefined);
      
      // Refresh the dashboard data
      await fetchDashboardData();
      alert('Project rejected successfully!');
    } catch (error) {
      console.error('Error rejecting project:', error);
      alert('Error rejecting project. Please try again.');
    }
  };

  const handleSubmitAppraisal = async (projectId: string) => {
    // For now, we'll simulate starting an appraisal process
    // In a real app, this would open an appraisal form
    const confirmed = confirm('Start technical appraisal for this project?');
    if (confirmed) {
      alert('Appraisal process initiated. Complete the technical evaluation and then approve/reject the project.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading District PACC Dashboard...</p>
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">District PACC Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Project Appraisals & Technical Evaluation - {user?.jurisdiction?.district}, {user?.jurisdiction?.state}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setMessagingOpen(true)}
            className="relative"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Appraisals</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingAppraisals}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Appraisals</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedAppraisals}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Appraisal Score</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.avgAppraisalScore}/100</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk Projects</p>
                  <p className="text-3xl font-bold text-red-600">{stats.highRiskProjects}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appraisals">Project Appraisals</TabsTrigger>
            <TabsTrigger value="evaluations">Technical Evaluations</TabsTrigger>
            <TabsTrigger value="convergence">Convergence Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Project Appraisals Tab */}
          <TabsContent value="appraisals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Pending Project Appraisals
                </CardTitle>
                <CardDescription>Review and appraise new project applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pendingAppraisals || []).map((project) => (
                    <div key={project._id} className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{project.projectName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {project.location?.village}, {project.location?.block}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {project.schemeType}
                            </span>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Needs Appraisal</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Project Value</p>
                          <p className="font-medium">₹{project.financials?.sanctionedAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium">{project.technicalDetails?.duration || 12} months</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Beneficiaries</p>
                          <p className="font-medium">{project.technicalDetails?.beneficiaryCount || 100}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download DPR
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveProject(project._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectProject(project._id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {pendingAppraisals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No pending appraisals</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Technical Evaluation Summary
                </CardTitle>
                <CardDescription>Detailed technical scores and feasibility assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appraisals.map((appraisal) => (
                    <div key={appraisal._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{appraisal.projectName}</h3>
                          <p className="text-sm text-gray-600">
                            Appraised on {new Date(appraisal.appraisalDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appraisal.status)}>
                            {appraisal.status}
                          </Badge>
                          <Badge className={appraisal.riskLevel === 'High' ? 'bg-red-100 text-red-800' : 
                                         appraisal.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-green-100 text-green-800'}>
                            {appraisal.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Score Bars */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Technical</span>
                            <span className="font-medium">{appraisal.technicalScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${appraisal.technicalScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Financial</span>
                            <span className="font-medium">{appraisal.financialScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${appraisal.financialScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Social</span>
                            <span className="font-medium">{appraisal.socialScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${appraisal.socialScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall</span>
                            <span className="font-bold">{appraisal.overallScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${appraisal.overallScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Feasibility:</span>
                          <Badge className={appraisal.feasibilityStatus === 'Feasible' ? 
                                         'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {appraisal.feasibilityStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {appraisal.status === 'Completed' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveProject(appraisal.projectId)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectProject(appraisal.projectId)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Convergence Analysis Tab */}
          <TabsContent value="convergence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Convergence Opportunities
                </CardTitle>
                <CardDescription>Identify synergies with other government schemes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">MGNREGA Convergence</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-2">12</div>
                      <p className="text-sm text-gray-600">Projects with MGNREGA convergence potential</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Swachh Bharat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-2">8</div>
                      <p className="text-sm text-gray-600">Projects aligned with sanitation goals</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Rural Housing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600 mb-2">6</div>
                      <p className="text-sm text-gray-600">Housing scheme integration opportunities</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Appraisal Recommendations
                </CardTitle>
                <CardDescription>Key recommendations and action items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appraisals.filter(a => a.status === 'Completed').map((appraisal) => (
                    <div key={appraisal._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{appraisal.projectName}</h3>
                        <Badge className={appraisal.overallScore >= 80 ? 'bg-green-100 text-green-800' : 
                                       appraisal.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800'}>
                          Score: {appraisal.overallScore}/100
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {appraisal.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
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
                  <Download className="h-5 w-5" />
                  Appraisal Reports
                </CardTitle>
                <CardDescription>Generate and download appraisal reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Technical Appraisal Summary
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Feasibility Assessment Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Convergence Analysis
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Risk Assessment Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Messaging Component */}
      <MessagingComponent 
        isOpen={messagingOpen} 
        onClose={() => setMessagingOpen(false)} 
      />
    </div>
  );
};

export default DistrictPACCDashboard;