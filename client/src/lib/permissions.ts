import { User } from '../contexts/AuthContext';

// Role hierarchy levels for permission checks
export const ROLE_LEVELS = {
  'super_admin': 10,
  'central_admin': 9,
  'state_nodal_admin': 8,
  'auditor_oversight': 8,
  'state_sc_corporation_admin': 7,
  'technical_support_group': 6,
  'district_collector': 6,
  'district_pacc_admin': 5,
  'implementing_agency_user': 4,
  'gram_panchayat_user': 3,
  'contractor_vendor': 2
} as const;

// Permission constants
export const PERMISSIONS = {
  // Data Access
  READ_ALL_DATA: 'read_all_data',
  WRITE_ALL_DATA: 'write_all_data',
  
  // User Management
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Project Management
  CREATE_PROJECT: 'create_project',
  UPDATE_PROJECT: 'update_project',
  DELETE_PROJECT: 'delete_project',
  APPROVE_PROJECT: 'approve_project',
  
  // Financial Management
  APPROVE_FUNDS: 'approve_funds',
  MANAGE_FUNDS: 'manage_funds',
  VIEW_FINANCIAL_DATA: 'view_financial_data',
  
  // Progress Management
  UPDATE_PROGRESS: 'update_progress',
  VERIFY_MILESTONE: 'verify_milestone',
  APPROVE_MILESTONE: 'approve_milestone',
  
  // Beneficiary Management
  MANAGE_BENEFICIARIES: 'manage_beneficiaries',
  VERIFY_BENEFICIARY: 'verify_beneficiary',
  
  // Administrative
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  SYSTEM_SUPPORT: 'system_support',
  
  // Regional Access
  MANAGE_STATE_DATA: 'manage_state_data',
  MANAGE_DISTRICT_DATA: 'manage_district_data',
  VILLAGE_VERIFICATION: 'village_verification'
} as const;

// Role-based default permissions
export const ROLE_PERMISSIONS = {
  'super_admin': [
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.WRITE_ALL_DATA,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.APPROVE_FUNDS,
    PERMISSIONS.MANAGE_FUNDS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.VERIFY_MILESTONE,
    PERMISSIONS.APPROVE_MILESTONE,
    PERMISSIONS.MANAGE_BENEFICIARIES,
    PERMISSIONS.VERIFY_BENEFICIARY,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.SYSTEM_SUPPORT,
    PERMISSIONS.MANAGE_STATE_DATA,
    PERMISSIONS.MANAGE_DISTRICT_DATA,
    PERMISSIONS.VILLAGE_VERIFICATION
  ],
  'central_admin': [
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.APPROVE_FUNDS,
    PERMISSIONS.MANAGE_FUNDS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.APPROVE_MILESTONE,
    PERMISSIONS.MANAGE_BENEFICIARIES,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_STATE_DATA
  ],
  'state_nodal_admin': [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.APPROVE_FUNDS,
    PERMISSIONS.MANAGE_FUNDS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.APPROVE_MILESTONE,
    PERMISSIONS.MANAGE_BENEFICIARIES,
    PERMISSIONS.VERIFY_BENEFICIARY,
    PERMISSIONS.MANAGE_STATE_DATA,
    PERMISSIONS.MANAGE_DISTRICT_DATA
  ],
  'district_collector': [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.APPROVE_FUNDS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.APPROVE_MILESTONE,
    PERMISSIONS.MANAGE_BENEFICIARIES,
    PERMISSIONS.VERIFY_BENEFICIARY,
    PERMISSIONS.MANAGE_DISTRICT_DATA
  ],
  'district_pacc_admin': [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.APPROVE_PROJECT,
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.VERIFY_MILESTONE,
    PERMISSIONS.APPROVE_MILESTONE,
    PERMISSIONS.MANAGE_BENEFICIARIES,
    PERMISSIONS.MANAGE_DISTRICT_DATA
  ],
  'implementing_agency_user': [
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.UPDATE_PROJECT,
    PERMISSIONS.MANAGE_BENEFICIARIES
  ],
  'gram_panchayat_user': [
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.VERIFY_MILESTONE,
    PERMISSIONS.VERIFY_BENEFICIARY,
    PERMISSIONS.VILLAGE_VERIFICATION
  ],
  'contractor_vendor': [
    PERMISSIONS.UPDATE_PROGRESS
  ],
  'auditor_oversight': [
    PERMISSIONS.READ_ALL_DATA,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.VIEW_AUDIT_LOGS
  ],
  'technical_support_group': [
    PERMISSIONS.SYSTEM_SUPPORT,
    PERMISSIONS.VIEW_AUDIT_LOGS
  ]
} as const;

// Permission check functions
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // Check user's explicit permissions first
  if (user.permissions.includes(permission)) return true;
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS];
  if (rolePermissions) {
    return rolePermissions.some(p => p === permission);
  }
  
  return false;
};

export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission));
};

export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  return permissions.every(permission => hasPermission(user, permission));
};

export const canAccessRole = (user: User | null, targetRole: string): boolean => {
  if (!user) return false;
  const userLevel = ROLE_LEVELS[user.role as keyof typeof ROLE_LEVELS] || 0;
  const targetLevel = ROLE_LEVELS[targetRole as keyof typeof ROLE_LEVELS] || 0;
  return userLevel >= targetLevel;
};

export const canAccessJurisdiction = (user: User | null, targetState?: string, targetDistrict?: string): boolean => {
  if (!user || !user.jurisdiction) return false;
  
  // Super admin and central admin can access all
  if (['super_admin', 'central_admin'].includes(user.role)) return true;
  
  // State level access
  if (user.jurisdiction.state === 'All' || user.jurisdiction.state === targetState) {
    // District level check
    if (!targetDistrict || user.jurisdiction.district === 'All' || user.jurisdiction.district === targetDistrict) {
      return true;
    }
  }
  
  return false;
};

// Dashboard route mappings
export const DASHBOARD_ROUTES = {
  'super_admin': '/dashboard/super-admin',
  'central_admin': '/dashboard/central-admin',
  'state_nodal_admin': '/dashboard/state-nodal',
  'state_sc_corporation_admin': '/dashboard/state-sc-corp',
  'district_collector': '/dashboard/district-collector',
  'district_pacc_admin': '/dashboard/district-pacc',
  'implementing_agency_user': '/dashboard/implementing-agency',
  'gram_panchayat_user': '/dashboard/gram-panchayat',
  'contractor_vendor': '/dashboard/contractor',
  'auditor_oversight': '/dashboard/auditor',
  'technical_support_group': '/dashboard/tech-support'
} as const;

export const getDashboardRoute = (role: string): string => {
  return DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES] || '/dashboard/gram-panchayat';
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  'super_admin': 'Super Admin',
  'central_admin': 'Central Admin',
  'state_nodal_admin': 'State Nodal Admin',
  'state_sc_corporation_admin': 'State SC Corporation Admin',
  'district_collector': 'District Collector',
  'district_pacc_admin': 'District PACC Admin',
  'implementing_agency_user': 'Implementing Agency User',
  'gram_panchayat_user': 'Gram Panchayat User',
  'contractor_vendor': 'Contractor/Vendor',
  'auditor_oversight': 'Auditor/Oversight',
  'technical_support_group': 'Technical Support Group'
} as const;

export const getRoleDisplayName = (role: string): string => {
  return ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES] || role;
};

// API helper functions
export const getAuthHeaders = (token: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const apiRequest = async (
  url: string, 
  options: RequestInit = {}, 
  token: string | null = null
) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
};

// Status and priority color mappings
export const STATUS_COLORS = {
  'Planned': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
  'On Hold': 'bg-orange-100 text-orange-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Pending': 'bg-gray-100 text-gray-800',
  'Delayed': 'bg-red-100 text-red-800',
  'Verified': 'bg-green-100 text-green-800',
  'Approved': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800'
} as const;

export const PRIORITY_COLORS = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-green-100 text-green-800'
} as const;

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800';
};