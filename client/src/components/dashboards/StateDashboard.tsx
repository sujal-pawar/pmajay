import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectsApi, milestonesApi, progressApi, fundsApi } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, TrendingUpIcon, CreditCardIcon } from 'lucide-react';

interface StateDashboardProps {
  className?: string;
}

const StateDashboard: React.FC<StateDashboardProps> = ({ className }) => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [pendingFunds, setPendingFunds] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingApprovals: 0,
    totalBudget: 0,
    utilizedBudget: 0,
    overdueProjects: 0,
    districtsActive: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch projects filtered by state
      const stateFilter = user?.jurisdiction?.state;
      const response = await projectsApi.getAll({ 
        limit: 100, 
        state: stateFilter 
      }, token || undefined);
      
      setProjects(response.data || []);

      // Fetch pending fund approvals for state
      try {
        const fundsResponse = await fundsApi.getPendingApprovals(token || undefined);
        setPendingFunds(fundsResponse.data || []);
      } catch (error) {
        console.warn('Could not fetch pending funds:', error);
        setPendingFunds([]);
      }

      // Calculate statistics
      const projectData = response.data || [];
      const totalProjects = projectData.length;
      const activeProjects = projectData.filter((p: any) => p.status === 'Active').length;
      const completedProjects = projectData.filter((p: any) => p.status === 'Completed').length;
      const pendingApprovals = projectData.filter((p: any) => 
        p.approvals?.stateApprovalStatus === 'Pending'
      ).length;
      
      const totalBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.sanctionedAmount || 0), 0);
      const utilizedBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.totalUtilized || 0), 0);
      
      // Get overdue projects
      const overdueProjects = projectData.filter((p: any) => {
        if (p.status === 'Completed') return false;
        const scheduledEnd = new Date(p.timeline?.scheduledEndDate);
        return scheduledEnd < new Date();
      }).length;

      // Count active districts
      const activeDistricts = new Set(
        projectData
          .filter((p: any) => p.status === 'Active')
          .map((p: any) => p.location?.district)
          .filter(Boolean)
      ).size;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        pendingApprovals,
        totalBudget,
        utilizedBudget,
        overdueProjects,
        districtsActive: activeDistricts
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      await projectsApi.update(projectId, {
        approvals: {
          stateApprovalStatus: 'Approved',
          districtApprovalStatus: 'Approved'
        }
      }, token || undefined);
      
      // Refresh data
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
          <h1 className="text-3xl font-bold text-gray-900">State Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {user?.jurisdiction?.state || 'State'} - PM-AJAY Projects Overview
          </p>
        </div>
        <Button onClick={fetchDashboardData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
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
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Districts</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.districtsActive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatCurrency(stats.totalBudget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilized</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatCurrency(stats.utilizedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBudget > 0 ? `${Math.round((stats.utilizedBudget / stats.totalBudget) * 100)}%` : '0%'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="districts">District View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>District-wise Distribution</CardTitle>
                <CardDescription>Projects by district in {user?.jurisdiction?.state}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(projects.map(p => p.location?.district).filter(Boolean))).slice(0, 8).map((district) => {
                    const districtProjects = projects.filter(p => p.location?.district === district);
                    const percentage = projects.length > 0 ? (districtProjects.length / projects.length) * 100 : 0;
                    
                    return (
                      <div key={district} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{district}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-12 text-right">
                            {districtProjects.length}
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
                <CardTitle>Scheme-wise Budget Allocation</CardTitle>
                <CardDescription>Budget distribution by scheme type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(projects.map(p => p.schemeType))).map((scheme) => {
                    const schemeProjects = projects.filter(p => p.schemeType === scheme);
                    const schemeBudget = schemeProjects.reduce((sum, p) => sum + (p.financials?.sanctionedAmount || 0), 0);
                    const percentage = stats.totalBudget > 0 ? (schemeBudget / stats.totalBudget) * 100 : 0;
                    
                    return (
                      <div key={scheme} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{scheme}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(schemeBudget)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Complete list of projects in {user?.jurisdiction?.state}</CardDescription>
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
                        <span>{project.location?.district}</span>
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

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projects Pending State Approval</CardTitle>
              <CardDescription>Projects awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects
                  .filter(p => p.approvals?.stateApprovalStatus === 'Pending')
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
                          <span>{project.location?.district}</span>
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
                
                {projects.filter(p => p.approvals?.stateApprovalStatus === 'Pending').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No projects pending approval
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="districts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(projects.map(p => p.location?.district).filter(Boolean))).map((district) => {
              const districtProjects = projects.filter(p => p.location?.district === district);
              const activeCount = districtProjects.filter(p => p.status === 'Active').length;
              const completedCount = districtProjects.filter(p => p.status === 'Completed').length;
              const totalBudget = districtProjects.reduce((sum, p) => sum + (p.financials?.sanctionedAmount || 0), 0);
              
              return (
                <Card key={district}>
                  <CardHeader>
                    <CardTitle className="text-lg">{district}</CardTitle>
                    <CardDescription>{districtProjects.length} projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active:</span>
                        <span className="font-semibold text-green-600">{activeCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed:</span>
                        <span className="font-semibold text-blue-600">{completedCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget:</span>
                        <span className="font-semibold">{formatCurrency(totalBudget)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StateDashboard;