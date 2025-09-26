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
