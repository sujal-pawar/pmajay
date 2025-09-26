const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectDashboard
} = require('../controllers/projectController');
const { authenticate } = require('../middlewares/auth');
const { roleAuth } = require('../middlewares/roleAuth');

// Apply authentication to all routes
router.use(authenticate);

// GET /api/projects - Get all projects with filtering
router.get('/', getAllProjects);

// POST /api/projects - Create new project
router.post('/', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin']),
  createProject
);

// GET /api/projects/:projectId - Get single project
router.get('/:projectId', getProjectById);

// PUT /api/projects/:projectId - Update project
router.put('/:projectId', 
  roleAuth(['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector']),
  updateProject
);

// DELETE /api/projects/:projectId - Delete project
router.delete('/:projectId', 
  roleAuth(['super_admin', 'central_admin']),
  deleteProject
);

// GET /api/projects/:projectId/dashboard - Get project dashboard data
router.get('/:projectId/dashboard', getProjectDashboard);

module.exports = router;