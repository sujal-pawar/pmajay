const User = require('../models/User');

// @desc    Get dashboard data based on user role
// @route   GET /api/dashboard/:role
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const dashboardData = await generateDashboardData(user);
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

// @desc    Get role-specific widgets and components
// @route   GET /api/dashboard/widgets
// @access  Private
exports.getDashboardWidgets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const widgets = getDashboardWidgets(user.role);
    
    res.status(200).json({
      success: true,
      data: widgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard widgets',
      error: error.message
    });
  }
};

// @desc    Get navigation menu based on user role
// @route   GET /api/dashboard/navigation
// @access  Private
exports.getDashboardNavigation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const navigation = getNavigationMenu(user.role, user.getRolePermissions());
    
    res.status(200).json({
      success: true,
      data: navigation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching navigation menu',
      error: error.message
    });
  }
};

// Generate dashboard data based on user role
async function generateDashboardData(user) {
  const baseData = {
    user: {
      name: user.name,
      role: user.role,
      jurisdiction: user.jurisdiction,
      department: user.department,
      agency: user.agency,
      permissions: user.getRolePermissions()
    },
    dashboardRoute: user.getDashboardRoute(),
    lastLogin: user.updatedAt
  };

  // Role-specific data generation
  switch (user.role) {
    case 'super_admin':
      return {
        ...baseData,
        stats: {
          totalUsers: await getTotalUsers(),
          totalProjects: await getTotalProjects(),
          totalBeneficiaries: await getTotalBeneficiaries(),
          systemHealth: await getSystemHealth()
        },
        recentActivities: await getRecentActivities('all'),
        alerts: await getSystemAlerts()
      };

    case 'central_admin':
      return {
        ...baseData,
        stats: {
          statesActive: await getActiveStates(),
          totalFundsDisbursed: await getTotalFundsDisbursed(),
          projectsUnderReview: await getProjectsUnderReview(),
          complianceRate: await getComplianceRate()
        },
        statePerformance: await getStatePerformance(),
        pendingApprovals: await getPendingApprovals('central')
      };

    case 'state_nodal_admin':
      return {
        ...baseData,
        stats: {
          districtsActive: await getActiveDistricts(user.jurisdiction?.state),
          stateFundsAllocated: await getStateFunds(user.jurisdiction?.state),
          beneficiariesCovered: await getBeneficiariesByState(user.jurisdiction?.state),
          projectsCompleted: await getCompletedProjects(user.jurisdiction?.state)
        },
        districtPerformance: await getDistrictPerformance(user.jurisdiction?.state),
        pendingApprovals: await getPendingApprovals('state', user.jurisdiction?.state)
      };

    case 'state_sc_corporation_admin':
      return {
        ...baseData,
        stats: {
          beneficiariesRegistered: await getBeneficiariesByState(user.jurisdiction?.state),
          grantsProcessed: await getGrantsProcessed(user.jurisdiction?.state),
          documentsVerified: await getDocumentsVerified(user.jurisdiction?.state),
          pendingVerifications: await getPendingVerifications(user.jurisdiction?.state)
        },
        beneficiaryBreakdown: await getBeneficiaryBreakdown(user.jurisdiction?.state),
        recentApplications: await getRecentApplications(user.jurisdiction?.state)
      };

    case 'district_collector':
      return {
        ...baseData,
        stats: {
          projectsInDistrict: await getProjectsByDistrict(user.jurisdiction?.district),
          beneficiariesInDistrict: await getBeneficiariesByDistrict(user.jurisdiction?.district),
          fundUtilization: await getFundUtilization(user.jurisdiction?.district),
          completionRate: await getCompletionRate(user.jurisdiction?.district)
        },
        projectStatus: await getProjectStatus(user.jurisdiction?.district),
        coordinationTasks: await getCoordinationTasks(user.jurisdiction?.district)
      };

    case 'district_pacc_admin':
      return {
        ...baseData,
        stats: {
          projectsForAppraisal: await getProjectsForAppraisal(user.jurisdiction?.district),
          appraisalsCompleted: await getAppraisalsCompleted(user.jurisdiction?.district),
          technicalEvaluations: await getTechnicalEvaluations(user.jurisdiction?.district),
          pendingRecommendations: await getPendingRecommendations(user.jurisdiction?.district)
        },
        appraisalQueue: await getAppraisalQueue(user.jurisdiction?.district),
        evaluationReports: await getEvaluationReports(user.jurisdiction?.district)
      };

    case 'implementing_agency_user':
      return {
        ...baseData,
        stats: {
          assignedProjects: await getAssignedProjects(user.agency),
          completedTasks: await getCompletedTasks(user.agency),
          pendingMilestones: await getPendingMilestones(user.agency),
          documentsUploaded: await getDocumentsUploaded(user.agency)
        },
        projectTimeline: await getProjectTimeline(user.agency),
        taskList: await getTaskList(user.agency)
      };

    case 'gram_panchayat_user':
      return {
        ...baseData,
        stats: {
          villageProjects: await getVillageProjects(user.jurisdiction?.village),
          beneficiariesVerified: await getBeneficiariesVerified(user.jurisdiction?.village),
          progressReports: await getProgressReports(user.jurisdiction?.village),
          pendingVerifications: await getPendingVerifications(user.jurisdiction?.village)
        },
        localProjects: await getLocalProjects(user.jurisdiction?.village),
        verificationQueue: await getVerificationQueue(user.jurisdiction?.village)
      };

    case 'contractor_vendor':
      return {
        ...baseData,
        stats: {
          contractsAssigned: await getContractsAssigned(user.id),
          deliverables: await getDeliverables(user.id),
          paymentsReceived: await getPaymentsReceived(user.id),
          performanceRating: await getPerformanceRating(user.id)
        },
        activeContracts: await getActiveContracts(user.id),
        upcomingDeadlines: await getUpcomingDeadlines(user.id)
      };

    case 'auditor_oversight':
      return {
        ...baseData,
        stats: {
          auditsCompleted: await getAuditsCompleted(),
          complianceIssues: await getComplianceIssues(),
          recommendationsImplemented: await getRecommendationsImplemented(),
          pendingAudits: await getPendingAudits()
        },
        auditTrail: await getAuditTrail(),
        complianceReports: await getComplianceReports()
      };

    case 'technical_support_group':
      return {
        ...baseData,
        stats: {
          ticketsResolved: await getTicketsResolved(),
          systemUptime: await getSystemUptime(),
          userSupportRequests: await getUserSupportRequests(),
          systemErrors: await getSystemErrors()
        },
        supportQueue: await getSupportQueue(),
        systemHealth: await getSystemHealth()
      };

    default:
      return baseData;
  }
}

// Helper function to get dashboard widgets based on role
function getDashboardWidgets(role) {
  const widgets = {
    super_admin: [
      { id: 'user_management', title: 'User Management', type: 'table', priority: 1 },
      { id: 'system_overview', title: 'System Overview', type: 'chart', priority: 2 },
      { id: 'audit_logs', title: 'Audit Logs', type: 'list', priority: 3 },
      { id: 'financial_summary', title: 'Financial Summary', type: 'stats', priority: 4 }
    ],
    central_admin: [
      { id: 'national_overview', title: 'National Overview', type: 'dashboard', priority: 1 },
      { id: 'state_performance', title: 'State Performance', type: 'chart', priority: 2 },
      { id: 'fund_management', title: 'Fund Management', type: 'table', priority: 3 }
    ],
    state_nodal_admin: [
      { id: 'state_overview', title: 'State Overview', type: 'dashboard', priority: 1 },
      { id: 'district_performance', title: 'District Performance', type: 'chart', priority: 2 },
      { id: 'project_approval', title: 'Project Approvals', type: 'list', priority: 3 }
    ],
    state_sc_corporation_admin: [
      { id: 'beneficiary_database', title: 'Beneficiary Database', type: 'table', priority: 1 },
      { id: 'grants_management', title: 'Grants Management', type: 'form', priority: 2 }
    ],
    district_collector: [
      { id: 'district_overview', title: 'District Overview', type: 'dashboard', priority: 1 },
      { id: 'project_coordination', title: 'Project Coordination', type: 'kanban', priority: 2 }
    ],
    district_pacc_admin: [
      { id: 'project_appraisal', title: 'Project Appraisal', type: 'form', priority: 1 },
      { id: 'technical_evaluation', title: 'Technical Evaluation', type: 'checklist', priority: 2 }
    ],
    implementing_agency_user: [
      { id: 'project_tasks', title: 'Project Tasks', type: 'kanban', priority: 1 },
      { id: 'milestone_tracking', title: 'Milestone Tracking', type: 'timeline', priority: 2 }
    ],
    gram_panchayat_user: [
      { id: 'village_projects', title: 'Village Projects', type: 'list', priority: 1 },
      { id: 'beneficiary_verification', title: 'Beneficiary Verification', type: 'form', priority: 2 }
    ],
    contractor_vendor: [
      { id: 'assigned_tasks', title: 'Assigned Tasks', type: 'list', priority: 1 },
      { id: 'progress_updates', title: 'Progress Updates', type: 'form', priority: 2 }
    ],
    auditor_oversight: [
      { id: 'audit_dashboard', title: 'Audit Dashboard', type: 'dashboard', priority: 1 },
      { id: 'compliance_reports', title: 'Compliance Reports', type: 'table', priority: 2 }
    ],
    technical_support_group: [
      { id: 'system_monitoring', title: 'System Monitoring', type: 'metrics', priority: 1 },
      { id: 'user_support', title: 'User Support', type: 'tickets', priority: 2 }
    ]
  };

  return widgets[role] || [];
}

// Helper function to get navigation menu based on role and permissions
function getNavigationMenu(role, permissions) {
  const baseMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: 'user', path: '/profile' }
  ];

  const roleSpecificMenus = {
    super_admin: [
      { id: 'users', label: 'User Management', icon: 'users', path: '/users' },
      { id: 'roles', label: 'Role Management', icon: 'shield', path: '/roles' },
      { id: 'system', label: 'System Settings', icon: 'settings', path: '/system' },
      { id: 'audit', label: 'Audit Logs', icon: 'file-text', path: '/audit' }
    ],
    central_admin: [
      { id: 'states', label: 'State Management', icon: 'map', path: '/states' },
      { id: 'funds', label: 'Fund Management', icon: 'dollar-sign', path: '/funds' },
      { id: 'reports', label: 'National Reports', icon: 'bar-chart', path: '/reports' }
    ],
    state_nodal_admin: [
      { id: 'districts', label: 'District Management', icon: 'map-pin', path: '/districts' },
      { id: 'projects', label: 'Project Approval', icon: 'check-circle', path: '/projects' },
      { id: 'beneficiaries', label: 'Beneficiary Management', icon: 'users', path: '/beneficiaries' }
    ],
    // Add more role-specific menus...
  };

  return [...baseMenu, ...(roleSpecificMenus[role] || [])];
}

// Placeholder functions for data fetching (to be implemented with actual database queries)
async function getTotalUsers() { return 1250; }
async function getTotalProjects() { return 450; }
async function getTotalBeneficiaries() { return 25000; }
async function getSystemHealth() { return { status: 'healthy', uptime: '99.8%' }; }
async function getRecentActivities() { return []; }
async function getSystemAlerts() { return []; }
async function getActiveStates() { return 28; }
async function getTotalFundsDisbursed() { return 5000000000; }
async function getProjectsUnderReview() { return 125; }
async function getComplianceRate() { return 94.5; }
async function getStatePerformance() { return []; }
async function getPendingApprovals() { return []; }
async function getActiveDistricts() { return 15; }
async function getStateFunds() { return 250000000; }
async function getBeneficiariesByState() { return 5000; }
async function getCompletedProjects() { return 45; }
async function getDistrictPerformance() { return []; }
async function getGrantsProcessed() { return 1200; }
async function getDocumentsVerified() { return 800; }
async function getPendingVerifications() { return 150; }
async function getBeneficiaryBreakdown() { return {}; }
async function getRecentApplications() { return []; }
async function getProjectsByDistrict() { return 25; }
async function getBeneficiariesByDistrict() { return 500; }
async function getFundUtilization() { return 78.5; }
async function getCompletionRate() { return 85.2; }
async function getProjectStatus() { return {}; }
async function getCoordinationTasks() { return []; }
async function getProjectsForAppraisal() { return 12; }
async function getAppraisalsCompleted() { return 8; }
async function getTechnicalEvaluations() { return 5; }
async function getPendingRecommendations() { return 3; }
async function getAppraisalQueue() { return []; }
async function getEvaluationReports() { return []; }
async function getAssignedProjects() { return 8; }
async function getCompletedTasks() { return 45; }
async function getPendingMilestones() { return 12; }
async function getDocumentsUploaded() { return 28; }
async function getProjectTimeline() { return []; }
async function getTaskList() { return []; }
async function getVillageProjects() { return 3; }
async function getBeneficiariesVerified() { return 125; }
async function getProgressReports() { return 8; }
async function getLocalProjects() { return []; }
async function getVerificationQueue() { return []; }
async function getContractsAssigned() { return 5; }
async function getDeliverables() { return 15; }
async function getPaymentsReceived() { return 2500000; }
async function getPerformanceRating() { return 4.5; }
async function getActiveContracts() { return []; }
async function getUpcomingDeadlines() { return []; }
async function getAuditsCompleted() { return 35; }
async function getComplianceIssues() { return 8; }
async function getRecommendationsImplemented() { return 28; }
async function getPendingAudits() { return 5; }
async function getAuditTrail() { return []; }
async function getComplianceReports() { return []; }
async function getTicketsResolved() { return 125; }
async function getSystemUptime() { return '99.9%'; }
async function getUserSupportRequests() { return 45; }
async function getSystemErrors() { return 3; }
async function getSupportQueue() { return []; }

module.exports = {
  getDashboardData,
  getDashboardWidgets,
  getDashboardNavigation
};