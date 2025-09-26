const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getProjectDashboard } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication to all routes
router.use(protect);

// Project routes
router.get('/', getAllProjects);
router.post('/', authorize(), createProject);
router.get('/:projectId', getProjectById);
router.put('/:projectId', authorize(), updateProject);
router.delete('/:projectId', authorize(), deleteProject);
router.get('/:projectId/dashboard', getProjectDashboard);

module.exports = router;
