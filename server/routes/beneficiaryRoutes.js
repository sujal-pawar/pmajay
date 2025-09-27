const express = require('express');
const router = express.Router({ mergeParams: true });
const { getBeneficiariesByProject, getBeneficiaryById, createBeneficiary, updateBeneficiary, verifyBeneficiary, getBeneficiaryStats, deleteBeneficiary } = require('../controllers/beneficiaryController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Beneficiary routes
router.get('/', getBeneficiariesByProject);
router.post('/', authorize(), createBeneficiary);
router.get('/stats', getBeneficiaryStats);
router.get('/:beneficiaryId', getBeneficiaryById);
router.put('/:beneficiaryId', authorize(), updateBeneficiary);
router.post('/:beneficiaryId/verify', authorize(), verifyBeneficiary);
router.delete('/:beneficiaryId', authorize(), deleteBeneficiary);

module.exports = router;
