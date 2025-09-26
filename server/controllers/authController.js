const User = require('../models/User');
const { generateToken } = require('../config/passport');

// @desc    Get current user
// @route   GET /api/auth/user
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-local.password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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



// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('token');
  res.status(200).json({ 
    success: true, 
    message: 'Successfully logged out' 
  });
};

// @desc    Update user role (Super Admin only)
// @route   PUT /api/auth/role/:userId
// @access  Private/Super Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role, jurisdiction, department, agency, permissions } = req.body;

    const validRoles = [
      'super_admin', 'central_admin', 'state_nodal_admin', 
      'state_sc_corporation_admin', 'district_collector', 'district_pacc_admin',
      'implementing_agency_user', 'gram_panchayat_user', 'contractor_vendor',
      'auditor_oversight', 'technical_support_group'
    ];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid role',
        validRoles
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${req.params.userId}`
      });
    }

    // Update user details
    user.role = role;
    if (jurisdiction) user.jurisdiction = jurisdiction;
    if (department) user.department = department;
    if (agency) user.agency = agency;
    if (permissions) user.permissions = permissions;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
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
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public (but requires role assignment by admin later)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, jurisdiction, department, agency } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user - default role is gram_panchayat_user
    const userData = {
      name,
      email,
      password,
      role: role || 'gram_panchayat_user',
      isEmailVerified: true // Remove email verification requirement
    };

    // Add optional fields if provided
    if (jurisdiction) userData.jurisdiction = jurisdiction;
    if (department) userData.department = department;
    if (agency) userData.agency = agency;

    user = await User.create(userData);

    // Generate token immediately (no email verification needed)
    const token = generateToken(user);
    const dashboardRoute = user.getDashboardRoute();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
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
          dashboardRoute: dashboardRoute
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Get user and include password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token and get role-based dashboard route
    const token = generateToken(user);
    const dashboardRoute = user.getDashboardRoute();

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      token,
      dashboardRoute,
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
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user dashboard route based on role
// @route   GET /api/auth/dashboard-route
// @access  Private
exports.getDashboardRoute = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const dashboardRoute = user.getDashboardRoute();
    const permissions = user.getRolePermissions();

    res.status(200).json({
      success: true,
      data: {
        dashboardRoute,
        role: user.role,
        permissions,
        jurisdiction: user.jurisdiction,
        department: user.department,
        agency: user.agency
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
