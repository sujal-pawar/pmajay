import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectsApi, milestonesApi, progressApi } from '../../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CalendarIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

interface CentralDashboardProps {
  className?: string;
}

const CentralDashboard: React.FC<CentralDashboardProps> = ({ className }) => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    utilizedBudget: 0,
    overdueProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all projects with pagination
      const response = await projectsApi.getAll({ limit: 50 }, token || undefined);
      
      // Handle different response formats
      let projectData: any[] = [];
      if (response && Array.isArray(response.data)) {
        projectData = response.data;
      } else if (response && Array.isArray(response)) {
        projectData = response;
      } else if (response && (response as any).projects && Array.isArray((response as any).projects)) {
        projectData = (response as any).projects;
      } else {
        console.warn('Unexpected response format:', response);
        projectData = [];
      }
      
      setProjects(projectData);

      // Calculate statistics
      const totalProjects = projectData.length;
      const activeProjects = projectData.filter((p: any) => p.status === 'Active' || p.status === 'In Progress').length;
      const completedProjects = projectData.filter((p: any) => p.status === 'Completed').length;
      const totalBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.sanctionedAmount || 0), 0);
      const utilizedBudget = projectData.reduce((sum: number, p: any) => sum + (p.financials?.totalUtilized || 0), 0);
      
      // Get overdue projects (scheduled end date passed but not completed)
      const overdueProjects = projectData.filter((p: any) => {
        if (p.status === 'Completed') return false;
        const scheduledEnd = new Date(p.timeline?.scheduledEndDate);
        return scheduledEnd < new Date();
      }).length;

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalBudget,
        utilizedBudget,
        overdueProjects
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
      setProjects([]); // Ensure projects is always an array
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Dashboard</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <Button onClick={fetchDashboardData}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Central Government Dashboard</h1>
          <p className="text-gray-600 mt-1">National overview of PM-AJAY projects</p>
        </div>
        <Button onClick={fetchDashboardData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.totalBudget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilized</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(stats.utilizedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalBudget > 0 ? `${Math.round((stats.utilizedBudget / stats.totalBudget) * 100)}%` : '0%'} of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest projects across all states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(projects) && projects.slice(0, 10).map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{project.projectName}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.projectDescription}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{project.location?.state}, {project.location?.district}</span>
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
            
            {(!Array.isArray(projects) || projects.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No projects found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scheme-wise Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scheme Distribution</CardTitle>
            <CardDescription>Projects by scheme type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(projects) && Array.from(new Set(projects.map(p => p.schemeType))).map((scheme) => {
                const schemeProjects = projects.filter(p => p.schemeType === scheme);
                const percentage = projects.length > 0 ? (schemeProjects.length / projects.length) * 100 : 0;
                
                return (
                  <div key={scheme} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{scheme}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {schemeProjects.length}
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
            <CardTitle>State-wise Distribution</CardTitle>
            <CardDescription>Projects by state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.isArray(projects) && Array.from(new Set(projects.map(p => p.location?.state).filter(Boolean))).slice(0, 8).map((state) => {
                const stateProjects = projects.filter(p => p.location?.state === state);
                const percentage = projects.length > 0 ? (stateProjects.length / projects.length) * 100 : 0;
                
                return (
                  <div key={state} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{state}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {stateProjects.length}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CentralDashboard;