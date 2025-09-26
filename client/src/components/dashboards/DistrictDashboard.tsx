import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectsApi, milestonesApi, progressApi, beneficiariesApi } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, UsersIcon, TrendingUpIcon } from 'lucide-react';

interface DistrictDashboardProps {
  className?: string;
}

const DistrictDashboard: React.FC<DistrictDashboardProps> = ({ className }) => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMilestones: 0,
    completedMilestones: 0,
    overdueMilestones: 0,
    totalBeneficiaries: 0,
    verifiedBeneficiaries: 0,
    totalBudget: 0,
    utilizedBudget: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects filtered by district
      const districtFilter = user?.jurisdiction?.district;
      const stateFilter = user?.jurisdiction?.state;
      
      const response = await projectsApi.getAll({ 
        limit: 100, 
        state: stateFilter,
        district: districtFilter 
      }, token || undefined);
      
      const projectData = response.data || [];
      setProjects(projectData);

      // Fetch milestones for all projects
      const allMilestones: any[] = [];
      const allBeneficiaries: any[] = [];
      
      for (const project of projectData) {
        try {
          const milestonesResponse = await milestonesApi.getByProject(project._id, token || undefined);
          allMilestones.push(...(milestonesResponse.data || []));
          
          const beneficiariesResponse = await beneficiariesApi.getByProject(project._id, token || undefined);
          allBeneficiaries.push(...(beneficiariesResponse.data || []));
        } catch (error) {
          console.warn(`Error fetching data for project ${project._id}:`, error);
        }
      }
      
      setMilestones(allMilestones);
      setBeneficiaries(allBeneficiaries);

      // Calculate statistics
      const totalProjects = projectData.length;
      const activeProjects = projectData.filter((p: any) => p.status === 'Active').length;
      const completedProjects = projectData.filter((p: any) => p.status === 'Completed').length;
      
      const totalBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.sanctionedAmount || 0), 0);
      const utilizedBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.totalUtilized || 0), 0);
      
      const totalMilestones = allMilestones.length;
      const completedMilestones = allMilestones.filter((m: any) => m.status === 'Completed').length;
      const overdueMilestones = allMilestones.filter((m: any) => {
        if (m.status === 'Completed') return false;
        const scheduledDate = new Date(m.scheduledDate);
        return scheduledDate < new Date();
      }).length;

      const totalBeneficiaries = allBeneficiaries.length;
      const verifiedBeneficiaries = allBeneficiaries.filter((b: any) => b.eligibilityStatus === 'Verified').length;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalMilestones,
        completedMilestones,
        overdueMilestones,
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      await projectsApi.update(projectId, {
        approvals: {
          districtApprovalStatus: 'Approved',
          stateApprovalStatus: 'Pending'
        }
      }, token || undefined);
      
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving project:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">District Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {user?.jurisdiction?.district}, {user?.jurisdiction?.state} - PM-AJAY Projects
          </p>
        </div>
        <Button onClick={fetchDashboardData}>
          Refresh Data
        </Button>
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
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueMilestones}</div>
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
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Block-wise Distribution</CardTitle>
                <CardDescription>Projects by block in {user?.jurisdiction?.district}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(projects.map(p => p.location?.block).filter(Boolean))).slice(0, 8).map((block) => {
                    const blockProjects = projects.filter(p => p.location?.block === block);
                    const percentage = projects.length > 0 ? (blockProjects.length / projects.length) * 100 : 0;
                    
                    return (
                      <div key={block} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{block}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">
                            {blockProjects.length}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Milestone completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed Milestones</span>
                    <span className="text-2xl font-bold text-green-600">
                      {stats.totalMilestones > 0 ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ 
                        width: `${stats.totalMilestones > 0 ? (stats.completedMilestones / stats.totalMilestones) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verified Beneficiaries</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats.totalBeneficiaries > 0 ? Math.round((stats.verifiedBeneficiaries / stats.totalBeneficiaries) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ 
                        width: `${stats.totalBeneficiaries > 0 ? (stats.verifiedBeneficiaries / stats.totalBeneficiaries) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>District Projects</CardTitle>
              <CardDescription>All projects in {user?.jurisdiction?.district}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
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
                        <span>{project.location?.block || 'N/A'}</span>
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

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Milestones</CardTitle>
              <CardDescription>Latest milestone updates across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.slice(0, 10).map((milestone) => {
                  const project = projects.find(p => p._id === milestone.projectId);
                  return (
                    <div key={milestone._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{milestone.milestoneName}</h4>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                          {milestone.verificationStatus && (
                            <Badge variant="outline">
                              {milestone.verificationStatus}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{project?.projectName}</p>
                        <p className="text-sm text-gray-500">{milestone.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Scheduled: {new Date(milestone.scheduledDate).toLocaleDateString()}
                        </div>
                        {milestone.actualCompletionDate && (
                          <div className="text-sm text-green-600">
                            Completed: {new Date(milestone.actualCompletionDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="text-sm font-medium">
                          {milestone.completionPercentage}% complete
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficiaries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beneficiaries</CardTitle>
              <CardDescription>Project beneficiaries in {user?.jurisdiction?.district}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {beneficiaries.slice(0, 10).map((beneficiary) => {
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects Pending District Approval</CardTitle>
              <CardDescription>Projects awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects
                  .filter(p => p.approvals?.districtApprovalStatus === 'Pending')
                  .map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.projectDescription}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{project.location?.block}</span>
                          <span>Budget: {formatCurrency(project.financials?.sanctionedAmount || 0)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveProject(project._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                
                {projects.filter(p => p.approvals?.districtApprovalStatus === 'Pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No projects pending approval
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictDashboard;