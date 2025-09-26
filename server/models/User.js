const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: [
        'super_admin',
        'central_admin', 
        'state_nodal_admin',
        'state_sc_corporation_admin',
        'district_collector',
        'district_pacc_admin',
        'implementing_agency_user',
        'gram_panchayat_user',
        'contractor_vendor',
        'auditor_oversight',
        'technical_support_group'
      ],
      default: 'gram_panchayat_user'
    },
    // Additional role-specific fields
    jurisdiction: {
      state: String,
      district: String,
      block: String,
      village: String
    },
    department: String,
    agency: String,
    permissions: [{
      type: String,
      enum: [
        'read_all_data',
        'write_all_data',
        'manage_users',
        'manage_roles',
        'approve_funds',
        'view_audit_logs',
        'manage_state_data',
        'approve_projects',
        'manage_beneficiaries',
        'district_coordination',
        'project_appraisal',
        'project_management',
        'village_verification',
        'contractor_updates',
        'audit_access',
        'system_support'
      ]
    }],
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    avatar: String,
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Middleware to hash password before save
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



// Method to get role-based permissions
userSchema.methods.getRolePermissions = function() {
  const rolePermissions = {
    super_admin: [
      'read_all_data', 'write_all_data', 'manage_users', 'manage_roles', 
      'approve_funds', 'view_audit_logs', 'manage_state_data', 'approve_projects',
      'manage_beneficiaries', 'district_coordination', 'project_appraisal', 
      'project_management', 'village_verification', 'contractor_updates',
      'audit_access', 'system_support'
    ],
    central_admin: [
      'read_all_data', 'approve_funds', 'view_audit_logs', 'manage_state_data',
      'approve_projects', 'manage_beneficiaries'
    ],
    state_nodal_admin: [
      'manage_state_data', 'approve_projects', 'manage_beneficiaries',
      'district_coordination', 'approve_funds'
    ],
    state_sc_corporation_admin: [
      'manage_beneficiaries', 'manage_state_data', 'approve_projects'
    ],
    district_collector: [
      'district_coordination', 'manage_beneficiaries', 'project_appraisal'
    ],
    district_pacc_admin: [
      'project_appraisal', 'district_coordination'
    ],
    implementing_agency_user: [
      'project_management', 'contractor_updates'
    ],
    gram_panchayat_user: [
      'village_verification', 'project_management'
    ],
    contractor_vendor: [
      'contractor_updates', 'project_management'
    ],
    auditor_oversight: [
      'audit_access', 'read_all_data'
    ],
    technical_support_group: [
      'system_support', 'manage_users'
    ]
  };
  
  return rolePermissions[this.role] || [];
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
  const rolePermissions = this.getRolePermissions();
  return rolePermissions.includes(permission) || this.permissions.includes(permission);
};

// Method to get dashboard route based on role
userSchema.methods.getDashboardRoute = function() {
  const dashboardRoutes = {
    super_admin: '/dashboard/super-admin',
    central_admin: '/dashboard/central-admin',
    state_nodal_admin: '/dashboard/state-nodal',
    state_sc_corporation_admin: '/dashboard/state-sc-corp',
    district_collector: '/dashboard/district-collector',
    district_pacc_admin: '/dashboard/district-pacc',
    implementing_agency_user: '/dashboard/implementing-agency',
    gram_panchayat_user: '/dashboard/gram-panchayat',
    contractor_vendor: '/dashboard/contractor',
    auditor_oversight: '/dashboard/auditor',
    technical_support_group: '/dashboard/tech-support'
  };
  
  return dashboardRoutes[this.role] || '/dashboard/default';
};

const User = mongoose.model('User', userSchema);

module.exports = User;
