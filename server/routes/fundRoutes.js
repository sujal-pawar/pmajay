const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getFundsByProject, 
  getFundById, 
  createFundTransaction, 
  updateFundTransaction, 
  approveFundTransaction, 
  getProjectFundSummary, 
  getPendingApprovals,
  initiateCentralRelease,
  processStateRelease,
  getFundFlowStatus,
  getStateTreasuryDashboard
} = require('../controllers/fundController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Fund flow automation routes (non-project specific)
router.post('/initiate-central-release', authorize(['super_admin', 'central_admin']), initiateCentralRelease);
router.post('/process-state-release', authorize(['state_treasury']), processStateRelease);
router.get('/state-treasury-dashboard', authorize(['state_treasury']), getStateTreasuryDashboard);

// Project-specific fund routes
router.get('/', getFundsByProject);
router.post('/', authorize(), createFundTransaction);
router.get('/summary', getProjectFundSummary);
router.get('/pending-approvals', getPendingApprovals);
router.get('/flow-status/:projectId', getFundFlowStatus);
router.get('/:fundId', getFundById);
router.put('/:fundId', authorize(), updateFundTransaction);
router.post('/:fundId/approve', authorize(), approveFundTransaction);

module.exports = router;
