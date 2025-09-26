const express = require('express');
const router = express.Router({ mergeParams: true });
const { getFundsByProject, getFundById, createFundTransaction, updateFundTransaction, approveFundTransaction, getProjectFundSummary, getPendingApprovals } = require('../controllers/fundController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Fund routes
router.get('/', getFundsByProject);
router.post('/', authorize(), createFundTransaction);
router.get('/summary', getProjectFundSummary);
router.get('/pending-approvals', getPendingApprovals);
router.get('/:fundId', getFundById);
router.put('/:fundId', authorize(), updateFundTransaction);
router.post('/:fundId/approve', authorize(), approveFundTransaction);

module.exports = router;
