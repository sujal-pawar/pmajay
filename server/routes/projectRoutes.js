const express = require('express');
const router = express.Router();
const { 
  getAllProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject, 
  getProjectDashboard,
  getPendingPACCApprovals,
  makePACCDecision,
  getPACCSummary
} = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// PACC-specific routes (must come before parameterized routes)
router.get('/pending-pacc-approval', authorize(['district_pacc_admin']), getPendingPACCApprovals);
router.get('/pacc-summary', authorize(['district_pacc_admin']), getPACCSummary);
router.post('/:id/pacc-decision', authorize(['district_pacc_admin']), makePACCDecision);

// Project routes
router.get('/', getAllProjects);
router.post('/', authorize(), createProject);
router.get('/:projectId', getProjectById);
router.put('/:projectId', authorize(), updateProject);
router.delete('/:projectId', authorize(), deleteProject);
router.get('/:projectId/dashboard', getProjectDashboard);

module.exports = router;
