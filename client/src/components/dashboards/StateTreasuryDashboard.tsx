import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { getStatusColor } from '../../lib/permissions';
import { 
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  Building,
  Users,
  MapPin,
  Calendar,
  RefreshCw,
  Shield
} from 'lucide-react';
import { 
  projectsApi, 
  fundsApi 
} from '../../services/api';

interface FundTransaction {
  _id: string;
  transactionId: string;
  projectId: string;
  projectName: string;
  transactionType: 'Release' | 'Utilization' | 'Refund';
  amount: number;
  transactionDate: string;
  sourceAgency: string;
  destinationAgency: string;
  status: string;
  pfmsReferenceNumber?: string;
  approvedBy?: string;
  purpose: string;
}

interface PendingPayment {
  _id: string;
  projectId: string;
  projectName: string;
  amount: number;
  requestDate: string;
  urgency: string;
  requestingAgency: string;
  purpose: string;
  daysOverdue: number;
}

const StateTreasuryDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalFundsReleased: 0,
    totalFundsUtilized: 0,
    pendingTransactions: 0,
    overduePayments: 0,
    transactionsToday: 0,
    pfmsReconciled: 0,
    auditFlags: 0,
    activeFundRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transfers');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stateFilter = user?.jurisdiction?.state;
      
      // Fetch all projects for the state
      const response = await projectsApi.getAll({ 
        limit: 100, 
        state: stateFilter
      }, token || undefined);
      
      const projectsData = response?.data?.projects || response?.data || [];
      const safeProjects = Array.isArray(projectsData) ? projectsData : [];
      
      setProjects(safeProjects);
      
      // Mock transaction data (in real app, this would come from Treasury API)
      const mockTransactions: FundTransaction[] = safeProjects.map((project, index) => [
        {
          _id: `txn_${project._id}_1`,
          transactionId: `TRN${Date.now() + index}001`,
          projectId: project._id,
          projectName: project.projectName,
          transactionType: 'Release' as const,
          amount: project.financials?.totalReleased || 0,
          transactionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          sourceAgency: 'Ministry of Social Justice & Empowerment',
          destinationAgency: 'State Treasury',
          status: 'Completed',
          pfmsReferenceNumber: `PFMS${Date.now() + index}`,
          purpose: 'Project fund release'
        },
        {
          _id: `txn_${project._id}_2`,
          transactionId: `TRN${Date.now() + index}002`,
          projectId: project._id,
          projectName: project.projectName,
          transactionType: 'Utilization' as const,
          amount: project.financials?.totalUtilized || 0,
          transactionDate: new Date().toISOString(),
          sourceAgency: 'State Treasury',
          destinationAgency: 'District Collector Office',
          status: index % 3 === 0 ? 'Pending' : 'Completed',
          pfmsReferenceNumber: `PFMS${Date.now() + index + 1000}`,
          purpose: 'Project implementation funds'
        }
      ]).flat();
      
      setTransactions(mockTransactions);
      
      // Mock pending payments
      const mockPendingPayments: PendingPayment[] = safeProjects.slice(0, 3).map((project, index) => ({
        _id: `payment_${project._id}`,
        projectId: project._id,
        projectName: project.projectName,
        amount: Math.floor(Math.random() * 2000000) + 500000,
        requestDate: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        urgency: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low',
        requestingAgency: 'District Collector Office',
        purpose: 'Next installment for project implementation',
        daysOverdue: (index + 1) * 7
      }));
      
      setPendingPayments(mockPendingPayments);
      
      // Calculate statistics
      const totalFundsReleased = mockTransactions
        .filter(t => t.transactionType === 'Release' && t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalFundsUtilized = mockTransactions
        .filter(t => t.transactionType === 'Utilization' && t.status === 'Completed')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const pendingTransactions = mockTransactions.filter(t => t.status === 'Pending').length;
      const overduePayments = mockPendingPayments.filter(p => p.daysOverdue > 7).length;
      const transactionsToday = mockTransactions.filter(t => 
        new Date(t.transactionDate).toDateString() === new Date().toDateString()
      ).length;
      
      setStats({
        totalFundsReleased,
        totalFundsUtilized,
        pendingTransactions,
        overduePayments,
        transactionsToday,
        pfmsReconciled: Math.floor(mockTransactions.length * 0.95),
        auditFlags: Math.floor(Math.random() * 5),
        activeFundRequests: mockPendingPayments.length
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = (paymentId: string) => {
    console.log(`Approve payment ${paymentId}`);
    // Implementation for payment approval
  };

  const handleRejectPayment = (paymentId: string) => {
    console.log(`Reject payment ${paymentId}`);
    // Implementation for payment rejection
  };

  const handleReconcilePFMS = () => {
    console.log('Reconcile with PFMS');
    // Implementation for PFMS reconciliation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading State Treasury Dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">State Treasury Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Fund Flow Management & Financial Reconciliation - {user?.jurisdiction?.state}
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funds Released</p>
                  <p className="text-2xl font-bold text-green-600">₹{(stats.totalFundsReleased / 10000000).toFixed(1)}Cr</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Funds Utilized</p>
                  <p className="text-2xl font-bold text-blue-600">₹{(stats.totalFundsUtilized / 10000000).toFixed(1)}Cr</p>
                </div>
                <ArrowDownLeft className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.activeFundRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats.overduePayments}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transfers">Fund Transfers</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="reconciliation">PFMS Reconciliation</TabsTrigger>
            <TabsTrigger value="audit">Audit & Compliance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Fund Transfers Tab */}
          <TabsContent value="transfers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Real-time Fund Transfer Status
                </CardTitle>
                <CardDescription>Track all fund movements and transaction status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(transactions || []).map((transaction) => (
                    <div key={transaction._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{transaction.projectName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(transaction.transactionDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {transaction.transactionId}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <Badge className={transaction.transactionType === 'Release' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {transaction.transactionType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-bold text-lg">₹{transaction.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-medium">{transaction.sourceAgency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-medium">{transaction.destinationAgency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">PFMS Ref</p>
                          <p className="font-medium">{transaction.pfmsReferenceNumber || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Purpose:</span> {transaction.purpose}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          {transaction.status === 'Pending' && (
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Process
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Payments Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Payment Requests
                </CardTitle>
                <CardDescription>Review and approve fund release requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(pendingPayments || []).map((payment) => (
                    <div key={payment._id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{payment.projectName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Requested: {new Date(payment.requestDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {payment.requestingAgency}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={payment.urgency === 'High' ? 'bg-red-100 text-red-800' : 
                                         payment.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-green-100 text-green-800'}>
                            {payment.urgency} Priority
                          </Badge>
                          {payment.daysOverdue > 7 && (
                            <Badge className="bg-red-100 text-red-800">
                              {payment.daysOverdue} days overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Requested Amount</p>
                          <p className="font-bold text-xl text-green-600">₹{payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Purpose</p>
                          <p className="font-medium">{payment.purpose}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprovePayment(payment._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve Payment
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRejectPayment(payment._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Request Clarification
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Request
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {pendingPayments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No pending payment requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PFMS Reconciliation Tab */}
          <TabsContent value="reconciliation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  PFMS Integration & Reconciliation
                </CardTitle>
                <CardDescription>Maintain transparency with PFMS system integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        PFMS Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-2">Connected</div>
                      <p className="text-sm text-gray-600">Last sync: {new Date().toLocaleTimeString()}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Reconciled Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{stats.pfmsReconciled}</div>
                      <p className="text-sm text-gray-600">Out of {transactions.length} total</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pending Reconciliation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600 mb-2">{transactions.length - stats.pfmsReconciled}</div>
                      <p className="text-sm text-gray-600">Needs attention</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Button onClick={handleReconcilePFMS}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reconcile with PFMS
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Reconciliation Report
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">PFMS Integration Benefits:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Real-time transaction tracking</li>
                    <li>• Automated compliance reporting</li>
                    <li>• Enhanced transparency and audit trail</li>
                    <li>• Reduced manual reconciliation effort</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit & Compliance Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Audit Trails & Compliance Monitoring
                </CardTitle>
                <CardDescription>Monitor expenditures and audit compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Audit Flags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600 mb-4">{stats.auditFlags}</div>
                      {stats.auditFlags > 0 ? (
                        <div className="space-y-2">
                          <div className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                            <p className="text-sm font-medium text-red-800">Delayed Payment Approval</p>
                            <p className="text-xs text-red-600">Payment pending for 15+ days</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No audit flags detected</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Compliance Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">96%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600">Above regulatory threshold</p>
                    </CardContent>
                  </Card>
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
                  Financial Reports & Analytics
                </CardTitle>
                <CardDescription>Generate comprehensive financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Fund Flow Statement
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Transaction History
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    PFMS Reconciliation Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Audit Compliance Report
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Pending Payments Summary
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Download className="h-6 w-6 mb-2" />
                    Expenditure Analysis
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

export default StateTreasuryDashboard;