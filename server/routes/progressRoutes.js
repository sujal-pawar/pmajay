const express = require('express');
const router = express.Router({ mergeParams: true });
const { 
  getProgressUpdatesByProject, 
  getProgressUpdateById, 
  createProgressUpdate, 
  updateProgressUpdate, 
  deleteProgressUpdate, 
  getProjectProgressSummary, 
  getIssues,
  getDashboardProgressUpdates,
  createProgressUpdateWithFlow
} = require('../controllers/progressController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Dashboard and role-based routes
router.get('/dashboard', getDashboardProgressUpdates);
router.post('/create-with-flow', authorize(), createProgressUpdateWithFlow);

// Progress routes
router.get('/', getProgressUpdatesByProject);
router.post('/', authorize(), createProgressUpdate);
router.get('/summary', getProjectProgressSummary);
router.get('/issues', getIssues);
router.get('/:updateId', getProgressUpdateById);
router.put('/:updateId', authorize(), updateProgressUpdate);
router.delete('/:updateId', authorize(), deleteProgressUpdate);

module.exports = router;
