const User = require('../models/User');

// Role hierarchy levels for access control
const ROLE_HIERARCHY = {
  super_admin: 10,
  central_admin: 9,
  state_nodal_admin: 8,
  state_sc_corporation_admin: 7,
  district_collector: 6,
  district_pacc_admin: 5,
  implementing_agency_user: 4,
  gram_panchayat_user: 3,
  contractor_vendor: 2,
  auditor_oversight: 8, // Special read-only access
  technical_support_group: 6
};

/**
 * Middleware to check if user has required role
 * @param {string|array} allowedRoles - Single role or array of allowed roles
 */
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userRole = req.user.role;
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions for this role'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Role verification failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user has required permission
 * @param {string|array} requiredPermissions - Single permission or array of required permissions
 */
const requirePermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every(permission => user.hasPermission(permission));

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required: permissions,
          current: user.getRolePermissions()
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Permission verification failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check role hierarchy (minimum level required)
 * @param {number} minLevel - Minimum hierarchy level required
 */
const requireMinLevel = (minLevel) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userLevel = ROLE_HIERARCHY[req.user.role] || 0;

      if (userLevel < minLevel) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient authority level',
          required: minLevel,
          current: userLevel
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authority level verification failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check jurisdiction access
 * @param {string} jurisdictionType - Type of jurisdiction (state, district, block, village)
 */
const requireJurisdiction = (jurisdictionType) => {
  return async (req, res, next) => {
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

      // Super admin and auditor have access to all jurisdictions
      if (['super_admin', 'central_admin', 'auditor_oversight'].includes(user.role)) {
        return next();
      }

      const requestedJurisdiction = req.params[jurisdictionType] || req.body[jurisdictionType] || req.query[jurisdictionType];
      const userJurisdiction = user.jurisdiction?.[jurisdictionType];

      if (!userJurisdiction) {
        return res.status(403).json({
          success: false,
          message: `User does not have ${jurisdictionType} jurisdiction assigned`
        });
      }

      if (requestedJurisdiction && userJurisdiction !== requestedJurisdiction) {
        return res.status(403).json({
          success: false,
          message: `Access denied for ${jurisdictionType}: ${requestedJurisdiction}`,
          userJurisdiction: userJurisdiction
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Jurisdiction verification failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to check if user can access specific data based on role and hierarchy
 */
const canAccessData = (dataType) => {
  return async (req, res, next) => {
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

      // Define data access rules based on role
      const dataAccessRules = {
        beneficiary_data: ['super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin', 'district_collector', 'gram_panchayat_user'],
        financial_data: ['super_admin', 'central_admin', 'state_nodal_admin', 'auditor_oversight'],
        project_data: ['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin', 'implementing_agency_user'],
        audit_data: ['super_admin', 'auditor_oversight'],
        system_data: ['super_admin', 'technical_support_group']
      };

      const allowedRoles = dataAccessRules[dataType];
      if (!allowedRoles || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied for ${dataType}`,
          allowedRoles: allowedRoles
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Data access verification failed',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to add user context and permissions to request
 */
const addUserContext = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        req.userContext = {
          role: user.role,
          permissions: user.getRolePermissions(),
          jurisdiction: user.jurisdiction,
          department: user.department,
          agency: user.agency,
          hierarchyLevel: ROLE_HIERARCHY[user.role] || 0,
          dashboardRoute: user.getDashboardRoute()
        };
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  requireRole,
  requirePermission,
  requireMinLevel,
  requireJurisdiction,
  canAccessData,
  addUserContext,
  ROLE_HIERARCHY
};