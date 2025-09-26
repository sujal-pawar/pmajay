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
const { authenticate } = require('../middlewares/auth');
const { roleAuth } = require('../middlewares/roleAuth');

// Apply authentication to all routes
router.use(authenticate);

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