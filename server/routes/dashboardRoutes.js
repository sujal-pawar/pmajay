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