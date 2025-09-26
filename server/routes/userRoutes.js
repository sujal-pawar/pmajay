const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUser, createUser, updateUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { requireRole, addUserContext } = require('../middlewares/roleAuth');

// Use protection and context middleware for all routes
router.use(protect);
router.use(addUserContext);

// User management routes
router.get('/', requireRole(['super_admin', 'central_admin']), getAllUsers);
router.post('/', requireRole(['super_admin']), createUser);

// User profile routes
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', requireRole(['super_admin']), deleteUser);

module.exports = router;
