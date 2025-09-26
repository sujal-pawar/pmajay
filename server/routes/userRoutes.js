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
