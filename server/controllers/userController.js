const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-local.password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-local.password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new user (Super Admin only)
// @route   POST /api/users
// @access  Private/Super Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, jurisdiction, department, agency, permissions } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user data object
    const userData = {
      name,
      email,
      password,
      role: role || 'gram_panchayat_user',
      isEmailVerified: true
    };

    // Add optional fields
    if (jurisdiction) userData.jurisdiction = jurisdiction;
    if (department) userData.department = department;
    if (agency) userData.agency = agency;
    if (permissions) userData.permissions = permissions;

    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          jurisdiction: user.jurisdiction,
          department: user.department,
          agency: user.agency,
          permissions: user.getRolePermissions(),
          dashboardRoute: user.getDashboardRoute()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, jurisdiction, department, agency, permissions } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`
      });
    }

    // Only allow users to update their own basic info, or admins to update any user
    const isOwnProfile = req.user.id === req.params.id;
    const hasAdminPermissions = req.userContext?.permissions?.includes('manage_users');

    if (!isOwnProfile && !hasAdminPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email && hasAdminPermissions) user.email = email; // Only admins can change email
    if (role && hasAdminPermissions) user.role = role; // Only admins can change role
    if (jurisdiction && hasAdminPermissions) user.jurisdiction = jurisdiction;
    if (department && hasAdminPermissions) user.department = department;
    if (agency && hasAdminPermissions) user.agency = agency;
    if (permissions && hasAdminPermissions) user.permissions = permissions;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          jurisdiction: user.jurisdiction,
          department: user.department,
          agency: user.agency,
          permissions: user.getRolePermissions(),
          dashboardRoute: user.getDashboardRoute()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Super Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.id}`
      });
    }

    // Prevent deletion of super admin users (except by other super admins)
    if (user.role === 'super_admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin user'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
