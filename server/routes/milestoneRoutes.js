const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMilestonesByProject, getMilestoneById, createMilestone, updateMilestone, deleteMilestone, verifyMilestone, getMilestoneTimeline, getOverdueMilestones } = require('../controllers/milestoneController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Milestone routes
router.get('/', getMilestonesByProject);
router.post('/', authorize(), createMilestone);
router.get('/timeline', getMilestoneTimeline);
router.get('/overdue', getOverdueMilestones);
router.get('/:milestoneId', getMilestoneById);
router.put('/:milestoneId', authorize(), updateMilestone);
router.delete('/:milestoneId', authorize(), deleteMilestone);
router.post('/:milestoneId/verify', authorize(), verifyMilestone);

module.exports = router;
