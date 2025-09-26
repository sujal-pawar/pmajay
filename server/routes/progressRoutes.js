const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProgressUpdatesByProject,
  getProgressUpdateById,
  createProgressUpdate,
  updateProgressUpdate,
  deleteProgressUpdate,
  getProjectProgressSummary,
  getIssues
} = require('../controllers/progressController');
const { authenticate } = require('../middlewares/auth');
const { roleAuth } = require('../middlewares/roleAuth');

// Apply authentication to all routes
router.use(authenticate);

// GET /api/projects/:projectId/progress - Get progress updates for project
router.get('/', getProgressUpdatesByProject);

// POST /api/projects/:projectId/progress - Create new progress update
router.post('/', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin',
    'district_collector', 'district_pacc_admin', 'implementing_agency_user', 
    'gram_panchayat_user', 'contractor_vendor'
  ]),
  createProgressUpdate
);

// GET /api/projects/:projectId/progress/summary - Get project progress summary
router.get('/summary', getProjectProgressSummary);

// GET /api/projects/:projectId/progress/issues - Get issues for project
router.get('/issues', getIssues);

// GET /api/projects/:projectId/progress/:updateId - Get single progress update
router.get('/:updateId', getProgressUpdateById);

// PUT /api/projects/:projectId/progress/:updateId - Update progress update
router.put('/:updateId', 
  roleAuth([
    'super_admin', 'central_admin', 'state_nodal_admin', 'district_collector',
    'implementing_agency_user', 'gram_panchayat_user', 'contractor_vendor'
  ]),
  updateProgressUpdate
);

// DELETE /api/projects/:projectId/progress/:updateId - Delete progress update
router.delete('/:updateId', 
  roleAuth(['super_admin', 'central_admin']),
  deleteProgressUpdate
);

module.exports = router;