const express = require('express');
const router = express.Router();
const { 
  logout, 
  getCurrentUser, 
  updateUserRole,
  register,
  login,
  getDashboardRoute
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { requireRole, addUserContext } = require('../middlewares/roleAuth');

// Email/Password Auth Routes
router.post('/register', register);
router.post('/login', login);

// Get current logged in user
router.get('/user', protect, addUserContext, getCurrentUser);

// Get user's dashboard route based on role
router.get('/dashboard-route', protect, getDashboardRoute);

// Update user role (Super Admin only)
router.put('/role/:userId', protect, requireRole('super_admin'), updateUserRole);

// Logout
router.get('/logout', logout);

module.exports = router;
