const express = require('express');
const router = express.Router();
const { getDashboardData, getDashboardWidgets, getDashboardNavigation } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const { addUserContext } = require('../middlewares/roleAuth');

// Apply authentication and context to all dashboard routes
router.use(protect);
router.use(addUserContext);

// Dashboard routes
router.get('/data', getDashboardData);
router.get('/widgets', getDashboardWidgets);
router.get('/navigation', getDashboardNavigation);

module.exports = router;
