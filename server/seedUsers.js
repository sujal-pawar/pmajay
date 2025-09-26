const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const roles = [
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
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing role-based users
    const roleEmails = roles.map(role => `${role}@gmail.com`);
    await User.deleteMany({ email: { $in: roleEmails } });
    console.log('Cleared existing role-based users');

    // Create users for each role
    for (const role of roles) {
      // Create new user - let the pre-save middleware handle password hashing
      const userData = {
        name: `${role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} User`,
        email: `${role}@gmail.com`, // Unique email for each role
        password: '123123',
        role: role,
        isEmailVerified: true,
        permissions: getPermissionsForRole(role),
        jurisdiction: getJurisdictionForRole(role)
      };

      const user = new User(userData);
      await user.save();
      
      console.log(`✅ Created user for role: ${role} with email: ${role}@gmail.com`);
    }

    console.log('\n🎉 All users created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: [role]@gmail.com (e.g., super_admin@gmail.com)');
    console.log('Password: 123123 (for all roles)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// Function to get permissions for each role based on the User model enum
function getPermissionsForRole(role) {
  const permissionMap = {
    'super_admin': [
      'read_all_data', 'write_all_data', 'manage_users', 'manage_roles', 
      'approve_funds', 'view_audit_logs', 'manage_state_data', 'approve_projects',
      'manage_beneficiaries', 'district_coordination', 'project_appraisal', 
      'project_management', 'village_verification', 'contractor_updates',
      'audit_access', 'system_support'
    ],
    'central_admin': [
      'read_all_data', 'approve_funds', 'view_audit_logs', 'manage_state_data',
      'approve_projects', 'manage_beneficiaries'
    ],
    'state_nodal_admin': [
      'manage_state_data', 'approve_projects', 'manage_beneficiaries',
      'district_coordination', 'approve_funds'
    ],
    'state_sc_corporation_admin': [
      'manage_beneficiaries', 'manage_state_data', 'approve_projects'
    ],
    'district_collector': [
      'district_coordination', 'manage_beneficiaries', 'project_appraisal'
    ],
    'district_pacc_admin': [
      'project_appraisal', 'district_coordination'
    ],
    'implementing_agency_user': [
      'project_management', 'contractor_updates'
    ],
    'gram_panchayat_user': [
      'village_verification', 'project_management'
    ],
    'contractor_vendor': [
      'contractor_updates', 'project_management'
    ],
    'auditor_oversight': [
      'audit_access', 'read_all_data'
    ],
    'technical_support_group': [
      'system_support', 'manage_users'
    ]
  };
  
  return permissionMap[role] || ['village_verification'];
}

// Function to get jurisdiction for each role
function getJurisdictionForRole(role) {
  const jurisdictionMap = {
    'super_admin': { state: 'All', district: 'All', block: 'All', village: 'All' },
    'central_admin': { state: 'All', district: 'All', block: 'All', village: 'All' },
    'state_nodal_admin': { state: 'Maharashtra', district: 'All', block: 'All', village: 'All' },
    'state_sc_corporation_admin': { state: 'Maharashtra', district: 'All', block: 'All', village: 'All' },
    'district_collector': { state: 'Maharashtra', district: 'Pune', block: 'All', village: 'All' },
    'district_pacc_admin': { state: 'Maharashtra', district: 'Pune', block: 'All', village: 'All' },
    'implementing_agency_user': { state: 'Maharashtra', district: 'Pune', block: 'Maval', village: 'All' },
    'gram_panchayat_user': { state: 'Maharashtra', district: 'Pune', block: 'Maval', village: 'Sample Village' },
    'contractor_vendor': { state: 'Maharashtra', district: 'Pune', block: 'Maval', village: 'Sample Village' },
    'auditor_oversight': { state: 'Maharashtra', district: 'All', block: 'All', village: 'All' },
    'technical_support_group': { state: 'All', district: 'All', block: 'All', village: 'All' }
  };
  
  return jurisdictionMap[role] || { state: 'Maharashtra', district: 'Pune', block: 'Maval', village: 'Sample Village' };
}

// Run the seed function
seedUsers();