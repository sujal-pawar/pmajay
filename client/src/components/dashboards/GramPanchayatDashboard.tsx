import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectsApi, milestonesApi, progressApi, beneficiariesApi } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, UsersIcon, TrendingUpIcon, CameraIcon, MessageCircle, Send, MapPin } from 'lucide-react';
import MessagingComponent from '../MessagingComponent';
import { useSocket } from '../../contexts/SocketContext';

interface GramPanchayatDashboardProps {
  className?: string;
}

const GramPanchayatDashboard: React.FC<GramPanchayatDashboardProps> = ({ className }) => {
  const { user, token } = useAuth();
  const { unreadCount, initiateConversation } = useSocket();
  const [projects, setProjects] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    pendingVerification: 0,
    totalBeneficiaries: 0,
    verifiedBeneficiaries: 0,
    totalBudget: 0,
    utilizedBudget: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [projectMessageDialog, setProjectMessageDialog] = useState(false);
  const [selectedProjectForMessage, setSelectedProjectForMessage] = useState<any>(null);
  const [projectMessageContent, setProjectMessageContent] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects filtered by gram panchayat area
      const villageFilter = user?.jurisdiction?.village;
      const blockFilter = user?.jurisdiction?.block;
      const districtFilter = user?.jurisdiction?.district;
      
      const response = await projectsApi.getAll({ 
        limit: 100, 
        district: districtFilter
      }, token || undefined);
      
      // Handle paginated response structure
      const projectsData = response?.data?.projects || response?.data || [];
      
      // Filter projects that affect the gram panchayat area
      const relevantProjects = Array.isArray(projectsData) ? projectsData.filter((project: any) => 
        !villageFilter || project.location?.village === villageFilter ||
        !blockFilter || project.location?.block === blockFilter
      ) : [];
      
      setProjects(relevantProjects);

      // Fetch related data for relevant projects
      const allMilestones: any[] = [];
      const allBeneficiaries: any[] = [];
      const allProgressUpdates: any[] = [];
      
      for (const project of relevantProjects) {
        try {
          const milestonesResponse = await milestonesApi.getByProject(project._id, token || undefined);
          const milestonesData = Array.isArray(milestonesResponse?.data) ? milestonesResponse.data : [];
          allMilestones.push(...milestonesData);
          
          const beneficiariesResponse = await beneficiariesApi.getByProject(project._id, token || undefined);
          const beneficiariesData = Array.isArray(beneficiariesResponse?.data) ? beneficiariesResponse.data : [];
          allBeneficiaries.push(...beneficiariesData);
          
          const progressResponse = await progressApi.getByProject(project._id, token || undefined);
          const progressData = Array.isArray(progressResponse?.data) ? progressResponse.data : [];
          allProgressUpdates.push(...progressData);
        } catch (error) {
          console.warn(`Error fetching data for project ${project._id}:`, error);
        }
      }
      
      setMilestones(allMilestones);
      setBeneficiaries(allBeneficiaries);
      setProgressUpdates(allProgressUpdates);

      // Calculate statistics
      const totalProjects = relevantProjects.length;
      const activeProjects = relevantProjects.filter((p: any) => p.status === 'Active').length;
      const completedProjects = relevantProjects.filter((p: any) => p.status === 'Completed').length;
      
      const totalBudget = relevantProjects.reduce((sum: number, p: any) => sum + (p.financials?.sanctionedAmount || 0), 0);
      const utilizedBudget = relevantProjects.reduce((sum: number, p: any) => sum + (p.financials?.totalUtilized || 0), 0);
      
      const totalMilestones = allMilestones.length;
      const completedMilestones = allMilestones.filter((m: any) => m.status === 'Completed').length;
      const pendingVerification = allMilestones.filter((m: any) => 
        m.status === 'Completed' && m.verificationStatus === 'Pending'
      ).length;

      const totalBeneficiaries = allBeneficiaries.length;
      const verifiedBeneficiaries = allBeneficiaries.filter((b: any) => b.eligibilityStatus === 'Verified').length;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalMilestones,
        completedMilestones,
        pendingVerification,
        totalBeneficiaries,
        verifiedBeneficiaries,
        totalBudget,
        utilizedBudget
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'verified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerifyMilestone = async () => {
    if (!selectedMilestone) return;
    
    try {
      await milestonesApi.verify(
        selectedMilestone.projectId,
        selectedMilestone._id,
        {
          verificationStatus: 'Verified',
          verificationRemarks: verificationRemarks,
          verifiedBy: user?.id,
          verificationDate: new Date().toISOString()
        },
        token || undefined
      );
      
      setVerificationDialog(false);
      setSelectedMilestone(null);
      setVerificationRemarks('');
      fetchDashboardData();
    } catch (error) {
      console.error('Error verifying milestone:', error);
    }
  };

  const handleCreateProgressUpdate = async (projectId: string, milestoneId?: string) => {
    try {
      await progressApi.create(projectId, {
        milestoneId,
        updateType: 'Field Verification',
        workCompleted: {
          description: 'Field verification completed by Gram Panchayat',
          quantitativeMetrics: {
            percentageCompleted: 100
          }
        },
        updatedBy: user?.id,
        updateDate: new Date().toISOString()
      }, token || undefined);
      
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating progress update:', error);
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gram Panchayat Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {user?.jurisdiction?.village || user?.jurisdiction?.block}, {user?.jurisdiction?.district} - Field Operations
          </p>
        </div>
        <div className="flex space-x-2">
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
          <Button onClick={fetchDashboardData}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMilestones}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedMilestones} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingVerification}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBeneficiaries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedBeneficiaries} verified
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.totalBudget)}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilized Budget</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.utilizedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBudget > 0 ? `${Math.round((stats.utilizedBudget / stats.totalBudget) * 100)}%` : '0%'} utilized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="progress">Progress Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates in your jurisdiction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(progressUpdates || []).slice(0, 5).map((update) => {
                    const project = projects.find(p => p._id === update.projectId);
                    return (
                      <div key={update._id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{project?.projectName}</h4>
                          <p className="text-sm text-gray-600">{update.workCompleted?.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(update.updateDate).toLocaleDateString()} • {update.updateType}
                          </p>
                        </div>
                        {update.workCompleted?.quantitativeMetrics?.percentageCompleted && (
                          <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">
                              {update.workCompleted.quantitativeMetrics.percentageCompleted}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.pendingVerification > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">Milestone Verification Pending</h4>
                        <p className="text-sm text-gray-600">{stats.pendingVerification} milestones need verification</p>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab('verification')}>
                        Review
                      </Button>
                    </div>
                  )}
                  
                  {stats.totalBeneficiaries > stats.verifiedBeneficiaries && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">Beneficiary Verification</h4>
                        <p className="text-sm text-gray-600">
                          {stats.totalBeneficiaries - stats.verifiedBeneficiaries} beneficiaries need verification
                        </p>
                      </div>
                      <Button size="sm" onClick={() => setActiveTab('beneficiaries')}>
                        Review
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">Submit Progress Update</h4>
                      <p className="text-sm text-gray-600">Report on ongoing project activities</p>
                    </div>
                    <Button size="sm" onClick={() => setActiveTab('progress')}>
                      Add Update
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Milestones Pending Verification</CardTitle>
              <CardDescription>Completed milestones awaiting your field verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(milestones || [])
                  .filter(m => m.status === 'Completed' && m.verificationStatus === 'Pending')
                  .map((milestone) => {
                    const project = projects.find(p => p._id === milestone.projectId);
                    return (
                      <div key={milestone._id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{milestone.milestoneName}</h4>
                            <Badge className="bg-orange-100 text-orange-800">
                              Needs Verification
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{project?.projectName}</p>
                          <p className="text-sm text-gray-500">{milestone.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span>Completed: {milestone.actualCompletionDate ? new Date(milestone.actualCompletionDate).toLocaleDateString() : 'N/A'}</span>
                            <span>{milestone.completionPercentage}% complete</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog open={verificationDialog && selectedMilestone?._id === milestone._id} onOpenChange={setVerificationDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => setSelectedMilestone(milestone)}
                              >
                                Verify
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Verify Milestone</DialogTitle>
                                <DialogDescription>
                                  Confirm that "{milestone.milestoneName}" has been completed as per requirements.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Verification Remarks</label>
                                  <Textarea
                                    value={verificationRemarks}
                                    onChange={(e) => setVerificationRemarks(e.target.value)}
                                    placeholder="Enter your verification remarks..."
                                    className="mt-1"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={handleVerifyMilestone} className="bg-green-600 hover:bg-green-700">
                                    Verify & Approve
                                  </Button>
                                  <Button variant="outline" onClick={() => setVerificationDialog(false)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCreateProgressUpdate(milestone.projectId, milestone._id)}
                          >
                            <CameraIcon className="h-4 w-4 mr-1" />
                            Add Photo
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                
                {milestones.filter(m => m.status === 'Completed' && m.verificationStatus === 'Pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No milestones pending verification
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Projects</CardTitle>
              <CardDescription>Projects in your jurisdiction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(projects || []).map((project) => (
                  <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{project.projectName}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.projectDescription}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{project.location?.village || project.location?.block}</span>
                        <span>{project.schemeType}</span>
                        <span>Budget: {formatCurrency(project.financials?.sanctionedAmount || 0)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Started: {new Date(project.timeline?.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Deadline: {new Date(project.timeline?.scheduledEndDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficiaries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Beneficiaries</CardTitle>
              <CardDescription>People benefiting from projects in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(beneficiaries || []).map((beneficiary) => {
                  const project = projects.find(p => p._id === beneficiary.projectId);
                  return (
                    <div key={beneficiary._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{beneficiary.personalInfo?.name}</h4>
                          <Badge className={getStatusColor(beneficiary.eligibilityStatus)}>
                            {beneficiary.eligibilityStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{project?.projectName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{beneficiary.personalInfo?.category}</span>
                          <span>{beneficiary.personalInfo?.gender}</span>
                          <span>Age: {beneficiary.personalInfo?.age}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{beneficiary.personalInfo?.address}</p>
                      </div>
                      <div className="text-right">
                        {beneficiary.verificationDate && (
                          <div className="text-sm text-green-600">
                            Verified: {new Date(beneficiary.verificationDate).toLocaleDateString()}
                          </div>
                        )}
                        {beneficiary.economicInfo?.annualIncome && (
                          <div className="text-sm text-gray-500">
                            Income: {formatCurrency(beneficiary.economicInfo.annualIncome)}
                          </div>
                        )}
                        {beneficiary.eligibilityStatus === 'Pending' && (
                          <Button size="sm" className="mt-2">
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progress Updates</CardTitle>
              <CardDescription>Recent field updates and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => {/* Open progress update form */}}>
                    Add Progress Update
                  </Button>
                </div>
                
                {(progressUpdates || []).map((update) => {
                  const project = projects.find(p => p._id === update.projectId);
                  return (
                    <div key={update._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{project?.projectName}</h4>
                        <Badge className={getStatusColor(update.updateType)}>
                          {update.updateType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{update.workCompleted?.description}</p>
                      
                      {update.workCompleted?.quantitativeMetrics && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          {update.workCompleted.quantitativeMetrics.percentageCompleted && (
                            <span>Progress: {update.workCompleted.quantitativeMetrics.percentageCompleted}%</span>
                          )}
                          {update.workCompleted.quantitativeMetrics.unitsCompleted && (
                            <span>
                              Units: {update.workCompleted.quantitativeMetrics.unitsCompleted} 
                              {update.workCompleted.quantitativeMetrics.measurementUnit && 
                                ` ${update.workCompleted.quantitativeMetrics.measurementUnit}`
                              }
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Updated: {new Date(update.updateDate).toLocaleDateString()}</span>
                        {update.evidence?.beforePhotos?.length || update.evidence?.afterPhotos?.length ? (
                          <span className="flex items-center gap-1">
                            <CameraIcon className="h-4 w-4" />
                            {(update.evidence.beforePhotos?.length || 0) + (update.evidence.afterPhotos?.length || 0)} photos
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Messaging Component */}
      <MessagingComponent 
        isOpen={messagingOpen} 
        onClose={() => setMessagingOpen(false)} 
      />
    </div>
  );
};

export default GramPanchayatDashboard;