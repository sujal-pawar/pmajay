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
const { authenticate } = require('../middlewares/auth');
const { roleAuth } = require('../middlewares/roleAuth');

// Apply authentication to all routes
router.use(authenticate);

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
  roleAuth(['super_admin', 'central_admin']),
  deleteBeneficiary
);

module.exports = router;