const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get projectId from parent route
const {
  getMilestonesByProject,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  verifyMilestone,
  getMilestoneTimeline,
  getOverdueMilestones
} = require('../controllers/milestoneController');
const { authenticate } = require('../middlewares/auth');
const { roleAuth } = require('../middlewares/roleAuth');

// Apply authentication to all routes
router.use(authenticate);

// GET /api/projects/:projectId/milestones - Get all milestones for project
router.get('/', getMilestonesByProject);

// POST /api/projects/:projectId/milestones - Create new milestone
router.post('/', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin', 'implementing_agency_user']),
  createMilestone
);

// GET /api/projects/:projectId/milestones/timeline - Get milestone timeline
router.get('/timeline', getMilestoneTimeline);

// GET /api/projects/:projectId/milestones/overdue - Get overdue milestones
router.get('/overdue', getOverdueMilestones);

// GET /api/projects/:projectId/milestones/:milestoneId - Get single milestone
router.get('/:milestoneId', getMilestoneById);

// PUT /api/projects/:projectId/milestones/:milestoneId - Update milestone
router.put('/:milestoneId', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin', 'implementing_agency_user']),
  updateMilestone
);

// DELETE /api/projects/:projectId/milestones/:milestoneId - Delete milestone
router.delete('/:milestoneId', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector']),
  deleteMilestone
);

// POST /api/projects/:projectId/milestones/:milestoneId/verify - Verify milestone completion
router.post('/:milestoneId/verify', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'auditor_oversight']),
  verifyMilestone
);

module.exports = router;