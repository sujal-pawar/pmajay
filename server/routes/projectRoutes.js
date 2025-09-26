const express = require('express');
const router = express.Router();
const { 
  logout, 
  getCurrentUser, 
  updateUserRole,
  register,
  login,
  getDashboardRoute
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { requireRole, addUserContext } = require('../middlewares/roleAuth');

// Email/Password Auth Routes
router.post('/register', register);
router.post('/login', login);

// Get current logged in user
router.get('/user', protect, addUserContext, getCurrentUser);

// Get user's dashboard route based on role
router.get('/dashboard-route', protect, getDashboardRoute);

// Update user role (Super Admin only)
router.put('/role/:userId', protect, requireRole('super_admin'), updateUserRole);

// Role and permission management routes
router.get('/roles', protect, requireRole(['super_admin']), (req, res) => {
  const roles = [
    { value: 'super_admin', label: 'Super Admin', level: 10 },
    { value: 'central_admin', label: 'Central Admin', level: 9 },
    { value: 'state_nodal_admin', label: 'State Nodal Admin', level: 8 },
    { value: 'state_sc_corporation_admin', label: 'State SC Corporation Admin', level: 7 },
    { value: 'district_collector', label: 'District Collector', level: 6 },
    { value: 'district_pacc_admin', label: 'District PACC Admin', level: 5 },
    { value: 'implementing_agency_user', label: 'Implementing Agency User', level: 4 },
    { value: 'gram_panchayat_user', label: 'Gram Panchayat User', level: 3 },
    { value: 'contractor_vendor', label: 'Contractor/Vendor', level: 2 },
    { value: 'auditor_oversight', label: 'Auditor/Oversight', level: 8 },
    { value: 'technical_support_group', label: 'Technical Support Group', level: 6 }
  ];
  
  res.json({
    success: true,
    data: roles
  });
});

router.get('/permissions', protect, requireRole(['super_admin', 'central_admin']), (req, res) => {
  const permissions = [
    { value: 'read_all_data', label: 'Read All Data' },
    { value: 'write_all_data', label: 'Write All Data' },
    { value: 'manage_users', label: 'Manage Users' },
    { value: 'manage_roles', label: 'Manage Roles' },
    { value: 'approve_funds', label: 'Approve Funds' },
    { value: 'view_audit_logs', label: 'View Audit Logs' },
    { value: 'manage_state_data', label: 'Manage State Data' },
    { value: 'approve_projects', label: 'Approve Projects' },
    { value: 'manage_beneficiaries', label: 'Manage Beneficiaries' },
    { value: 'district_coordination', label: 'District Coordination' },
    { value: 'project_appraisal', label: 'Project Appraisal' },
    { value: 'project_management', label: 'Project Management' },
    { value: 'village_verification', label: 'Village Verification' },
    { value: 'contractor_updates', label: 'Contractor Updates' },
    { value: 'audit_access', label: 'Audit Access' },
    { value: 'system_support', label: 'System Support' }
  ];
  
  res.json({
    success: true,
    data: permissions
  });
});

// Logout
router.get('/logout', logout);

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBeneficiariesByProject,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  verifyBeneficiary,
  getBeneficiaryStats,
  deleteBeneficiary
} = require('../controllers/beneficiaryController');
const { protect, authorize } = require('../middlewares/auth');


// Apply authentication to all routes
router.use(protect);

// GET /api/projects/:projectId/beneficiaries - Get beneficiaries for project
router.get('/', getBeneficiariesByProject);

// POST /api/projects/:projectId/beneficiaries - Create new beneficiary
router.post('/', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'gram_panchayat_user'
  ]),
  createBeneficiary
);

// GET /api/projects/:projectId/beneficiaries/stats - Get beneficiary statistics
router.get('/stats', getBeneficiaryStats);

// GET /api/projects/:projectId/beneficiaries/:beneficiaryId - Get single beneficiary
router.get('/:beneficiaryId', getBeneficiaryById);

// PUT /api/projects/:projectId/beneficiaries/:beneficiaryId - Update beneficiary
router.put('/:beneficiaryId', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'gram_panchayat_user'
  ]),
  updateBeneficiary
);

// POST /api/projects/:projectId/beneficiaries/:beneficiaryId/verify - Verify beneficiary
router.post('/:beneficiaryId/verify', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'gram_panchayat_user'
  ]),
  verifyBeneficiary
);

// DELETE /api/projects/:projectId/beneficiaries/:beneficiaryId - Delete beneficiary
router.delete('/:beneficiaryId', 
  authorize(),
  deleteBeneficiary
);

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  getDashboardWidgets, 
  getDashboardNavigation 
} = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const { addUserContext, requireRole } = require('../middlewares/roleAuth');

// Apply authentication and context to all dashboard routes
router.use(protect);
router.use(addUserContext);

// @desc    Get role-specific dashboard data
// @route   GET /api/dashboard/data
// @access  Private
router.get('/data', getDashboardData);

// @desc    Get dashboard widgets based on role
// @route   GET /api/dashboard/widgets
// @access  Private
router.get('/widgets', getDashboardWidgets);

// @desc    Get navigation menu based on role
// @route   GET /api/dashboard/navigation
// @access  Private
router.get('/navigation', getDashboardNavigation);

// Role-specific dashboard routes
router.get('/super-admin', requireRole('super_admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Super Admin Dashboard',
      description: 'Complete system control and oversight',
      features: [
        'User and Role Management',
        'System Configuration',
        'Audit Trail Monitoring',
        'Cross-State Analytics',
        'Financial Controls'
      ]
    }
  });
});

router.get('/central-admin', requireRole('central_admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Central Admin Dashboard',
      description: 'National level program monitoring and control',
      features: [
        'State Performance Analytics',
        'Fund Disbursal Management',
        'Compliance Monitoring',
        'National Reporting'
      ]
    }
  });
});

router.get('/state-nodal', requireRole('state_nodal_admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'State Nodal Admin Dashboard',
      description: 'State-level program management and coordination',
      features: [
        'District Performance Tracking',
        'Project Approval Workflow',
        'Beneficiary Management',
        'State Fund Allocation'
      ]
    }
  });
});

router.get('/state-sc-corp', requireRole('state_sc_corporation_admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'State SC Corporation Dashboard',
      description: 'SC community focused program management',
      features: [
        'Beneficiary Database Management',
        'Grant Processing',
        'Community Outreach Tracking',
        'State-level Reporting'
      ]
    }
  });
});

router.get('/district-collector', requireRole('district_collector'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'District Collector Dashboard',
      description: 'District-level coordination and oversight',
      features: [
        'Project Coordination',
        'Inter-department Liaison',
        'Progress Monitoring',
        'Resource Allocation'
      ]
    }
  });
});

router.get('/district-pacc', requireRole('district_pacc_admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'District PACC Dashboard',
      description: 'Project appraisal and technical evaluation',
      features: [
        'Project Appraisal Queue',
        'Technical Evaluation Tools',
        'Recommendation Workflow',
        'Approval Documentation'
      ]
    }
  });
});

router.get('/implementing-agency', requireRole('implementing_agency_user'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Implementing Agency Dashboard',
      description: 'Project execution and milestone tracking',
      features: [
        'Task Management',
        'Milestone Tracking',
        'Document Upload',
        'Progress Reporting'
      ]
    }
  });
});

router.get('/gram-panchayat', requireRole('gram_panchayat_user'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Gram Panchayat Dashboard',
      description: 'Village-level program implementation',
      features: [
        'Beneficiary Verification',
        'Local Project Tracking',
        'Community Engagement',
        'Field Reports'
      ]
    }
  });
});

router.get('/contractor', requireRole('contractor_vendor'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Contractor Dashboard',
      description: 'Contract execution and deliverable management',
      features: [
        'Contract Management',
        'Deliverable Tracking',
        'Progress Updates',
        'Payment Status'
      ]
    }
  });
});

router.get('/auditor', requireRole('auditor_oversight'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Auditor Dashboard',
      description: 'Compliance monitoring and audit management',
      features: [
        'Audit Trail Access',
        'Compliance Monitoring',
        'Report Generation',
        'Recommendation Tracking'
      ]
    }
  });
});

router.get('/tech-support', requireRole('technical_support_group'), (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Technical Support Dashboard',
      description: 'System maintenance and user support',
      features: [
        'System Health Monitoring',
        'User Support Queue',
        'Error Log Analysis',
        'Performance Metrics'
      ]
    }
  });
});

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getFundsByProject,
  getFundById,
  createFundTransaction,
  updateFundTransaction,
  approveFundTransaction,
  getProjectFundSummary,
  getPendingApprovals
} = require('../controllers/fundController');
const { protect, authorize } = require('../middlewares/auth');


// Apply authentication to all routes
router.use(protect);

// GET /api/projects/:projectId/funds - Get fund transactions for project
router.get('/', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'auditor_oversight'
  ]),
  getFundsByProject
);

// POST /api/projects/:projectId/funds - Create new fund transaction
router.post('/', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 
    'district_collector', 'district_pacc_admin'
  ]),
  createFundTransaction
);

// GET /api/projects/:projectId/funds/summary - Get project fund summary
router.get('/summary', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'auditor_oversight'
  ]),
  getProjectFundSummary
);

// GET /api/funds/pending-approvals - Get pending approvals for user
router.get('/pending-approvals', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin'
  ]),
  getPendingApprovals
);

// GET /api/projects/:projectId/funds/:fundId - Get single fund transaction
router.get('/:fundId', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'auditor_oversight'
  ]),
  getFundById
);

// PUT /api/projects/:projectId/funds/:fundId - Update fund transaction
router.put('/:fundId', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 
    'district_collector', 'district_pacc_admin'
  ]),
  updateFundTransaction
);

// POST /api/projects/:projectId/funds/:fundId/approve - Approve/reject fund transaction
router.post('/:fundId/approve', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin'
  ]),
  approveFundTransaction
);

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get projectId from parent route
const {
  getMilestonesByProject,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  verifyMilestone,
  getMilestoneTimeline,
  getOverdueMilestones
} = require('../controllers/milestoneController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// GET /api/projects/:projectId/milestones - Get all milestones for project
router.get('/', getMilestonesByProject);

// POST /api/projects/:projectId/milestones - Create new milestone
router.post('/', 
  authorize(),
  createMilestone
);

// GET /api/projects/:projectId/milestones/timeline - Get milestone timeline
router.get('/timeline', getMilestoneTimeline);

// GET /api/projects/:projectId/milestones/overdue - Get overdue milestones
router.get('/overdue', getOverdueMilestones);

// GET /api/projects/:projectId/milestones/:milestoneId - Get single milestone
router.get('/:milestoneId', getMilestoneById);

// PUT /api/projects/:projectId/milestones/:milestoneId - Update milestone
router.put('/:milestoneId', 
  authorize(),
  updateMilestone
);

// DELETE /api/projects/:projectId/milestones/:milestoneId - Delete milestone
router.delete('/:milestoneId', 
  authorize(),
  deleteMilestone
);

// POST /api/projects/:projectId/milestones/:milestoneId/verify - Verify milestone completion
router.post('/:milestoneId/verify', 
  authorize(),
  verifyMilestone
);

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProgressUpdatesByProject,
  getProgressUpdateById,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
  getProjectProgressSummary,
  getIssues
} = require('../controllers/progressController');
const { protect, authorize } = require('../middlewares/auth');


// Apply authentication to all routes
router.use(protect);

// GET /api/projects/:projectId/progress - Get progress updates for project
router.get('/', getProgressUpdatesByProject);

// POST /api/projects/:projectId/progress - Create new progress update
router.post('/', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'implementing_agency_user', 
    'gram_panchayat_user', 'contractor_vendor'
  ]),
  createProgressUpdate
);

// GET /api/projects/:projectId/progress/summary - Get project progress summary
router.get('/summary', getProjectProgressSummary);

// GET /api/projects/:projectId/progress/issues - Get issues for project
router.get('/issues', getIssues);

// GET /api/projects/:projectId/progress/:updateId - Get single progress update
router.get('/:updateId', getProgressUpdateById);

// PUT /api/projects/:projectId/progress/:updateId - Update progress update
router.put('/:updateId', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'district_collector',
    'implementing_agency_user', 'gram_panchayat_user', 'contractor_vendor'
  ]),
  updateProgressUpdate
);

// DELETE /api/projects/:projectId/progress/:updateId - Delete progress update
router.delete('/:updateId', 
  authorize(),
  deleteProgressUpdate
);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectDashboard
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// GET /api/projects - Get all projects with filtering
router.get('/', getAllProjects);

// POST /api/projects - Create new project
router.post('/', 
  authorize('super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin'),
  createProject
);

// GET /api/projects/:projectId - Get single project
router.get('/:projectId', getProjectById);

// PUT /api/projects/:projectId - Update project
router.put('/:projectId', 
  authorize('super_admin', 'central_admin', 'state_nodal_admin', 'district_collector'),
  updateProject
);

// DELETE /api/projects/:projectId - Delete project
router.delete('/:projectId', 
  authorize('super_admin', 'central_admin'),
  deleteProject
);

// GET /api/projects/:projectId/dashboard - Get project dashboard data
router.get('/:projectId/dashboard', getProjectDashboard);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, createUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { 
  requireRole, 
  requirePermission, 
  requireMinLevel, 
  requireJurisdiction,
  canAccessData,
  addUserContext 
} = require('../middlewares/roleAuth');

// Use protection and context middleware for all routes
router.use(protect);
router.use(addUserContext);

// Super Admin and Central Admin routes - User management
router.get('/', 
  requireRole(['super_admin', 'central_admin', 'technical_support_group']), 
  getAllUsers
);

router.post('/', 
  requireRole(['super_admin']), 
  createUser
);

// User profile routes - accessible by user themselves or higher authority
router.route('/:id')
  .get(async (req, res, next) => {
    // Allow users to view their own profile or require admin permissions
    if (req.user.id === req.params.id) {
      return next();
    }
    return requirePermission('manage_users')(req, res, next);
  }, getUserById)
  .put(async (req, res, next) => {
    // Allow users to update their own profile or require admin permissions
    if (req.user.id === req.params.id) {
      return next();
    }
    return requireRole(['super_admin', 'central_admin'])(req, res, next);
  }, updateUser)
  .delete(requireRole(['super_admin']), deleteUser);

// Role-based data access routes
router.get('/beneficiaries/all', 
  canAccessData('beneficiary_data'),
  requireJurisdiction('state'),
  getAllUsers // This would be replaced with actual beneficiary controller
);

router.get('/projects/state/:state', 
  canAccessData('project_data'),
  requireJurisdiction('state'),
  getAllUsers // This would be replaced with actual project controller
);

router.get('/projects/district/:district', 
  canAccessData('project_data'),
  requireJurisdiction('district'),
  getAllUsers // This would be replaced with actual project controller
);

router.get('/financial/state/:state', 
  canAccessData('financial_data'),
  requireMinLevel(8), // Only high-level roles
  getAllUsers // This would be replaced with actual financial controller
);

router.get('/audit/logs', 
  canAccessData('audit_data'),
  getAllUsers // This would be replaced with actual audit controller
);

router.get('/system/health', 
  canAccessData('system_data'),
  getAllUsers // This would be replaced with actual system controller
);

// Dashboard routes based on role
router.get('/dashboard/data', async (req, res) => {
  try {
    const { role, jurisdiction, permissions } = req.userContext;
    
    // Return role-specific dashboard data
    const dashboardData = {
      role,
      permissions,
      jurisdiction,
      dashboardComponents: getDashboardComponents(role),
      accessibleRoutes: getAccessibleRoutes(role, permissions)
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Helper function to get dashboard components based on role
function getDashboardComponents(role) {
  const dashboardComponents = {
    super_admin: [
      'system_overview', 'user_management', 'role_management', 
      'audit_logs', 'financial_summary', 'state_analytics', 
      'project_monitoring', 'beneficiary_overview'
    ],
    central_admin: [
      'national_overview', 'state_performance', 'fund_management', 
      'compliance_dashboard', 'beneficiary_analytics'
    ],
    state_nodal_admin: [
      'state_overview', 'district_performance', 'project_approval', 
      'beneficiary_management', 'fund_allocation'
    ],
    state_sc_corporation_admin: [
      'beneficiary_database', 'grants_management', 'state_reporting'
    ],
    district_collector: [
      'district_overview', 'project_coordination', 'beneficiary_verification'
    ],
    district_pacc_admin: [
      'project_appraisal', 'technical_evaluation', 'approval_workflow'
    ],
    implementing_agency_user: [
      'project_tasks', 'milestone_tracking', 'document_upload'
    ],
    gram_panchayat_user: [
      'village_projects', 'beneficiary_verification', 'progress_reports'
    ],
    contractor_vendor: [
      'assigned_tasks', 'progress_updates', 'deliverables'
    ],
    auditor_oversight: [
      'audit_dashboard', 'compliance_reports', 'project_review'
    ],
    technical_support_group: [
      'system_monitoring', 'user_support', 'troubleshooting'
    ]
  };
  
  return dashboardComponents[role] || ['basic_dashboard'];
}

// Helper function to get accessible routes based on role and permissions
function getAccessibleRoutes(role, permissions) {
  const routes = [];
  
  if (permissions.includes('read_all_data')) {
    routes.push('/api/data/all');
  }
  if (permissions.includes('manage_users')) {
    routes.push('/api/users');
  }
  if (permissions.includes('approve_funds')) {
    routes.push('/api/funds/approve');
  }
  if (permissions.includes('manage_beneficiaries')) {
    routes.push('/api/beneficiaries');
  }
  if (permissions.includes('project_management')) {
    routes.push('/api/projects/manage');
  }
  if (permissions.includes('audit_access')) {
    routes.push('/api/audit');
  }
  
  return routes;
}

module.exports = router;
