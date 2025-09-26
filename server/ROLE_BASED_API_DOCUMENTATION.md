# PM-AJAY Role-Based Authentication API Documentation

## Overview
This API implements a comprehensive role-based authentication and authorization system for the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojna) program. The system supports 11 distinct user roles with granular permissions and access controls.

## Authentication Changes
- **Email OTP Verification Removed**: Users no longer need to verify their email with OTP codes
- **Immediate Login**: Upon successful registration, users can login immediately
- **Role-Based Dashboards**: Each role has a specific dashboard route and components

## User Roles & Hierarchy

### 1. Super Admin (Level 10)
**Full system access with complete control over all operations**
- **Permissions**: All permissions (read_all_data, write_all_data, manage_users, manage_roles, etc.)
- **Dashboard Route**: `/dashboard/super-admin`
- **Access**: Complete system control, user management, audit logs, cross-state analytics

### 2. Central Admin (Level 9)
**National-level program oversight and fund management**
- **Permissions**: read_all_data, approve_funds, view_audit_logs, manage_state_data, approve_projects, manage_beneficiaries
- **Dashboard Route**: `/dashboard/central-admin`
- **Access**: Aggregated state data, fund disbursal controls, compliance dashboards

### 3. State Nodal Admin (Level 8)
**State-level program management and coordination**
- **Permissions**: manage_state_data, approve_projects, manage_beneficiaries, district_coordination, approve_funds
- **Dashboard Route**: `/dashboard/state-nodal`
- **Access**: State and district project data, budgets, beneficiary records

### 4. State SC Corporation Admin (Level 7)
**SC community focused program management**
- **Permissions**: manage_beneficiaries, manage_state_data, approve_projects
- **Dashboard Route**: `/dashboard/state-sc-corp`
- **Access**: Beneficiary databases, grants, state-level reporting

### 5. District Collector (Level 6)
**District-level coordination and oversight**
- **Permissions**: district_coordination, manage_beneficiaries, project_appraisal
- **Dashboard Route**: `/dashboard/district-collector`
- **Access**: District-specific applications, prioritization tools, monitoring dashboards

### 6. District PACC Admin (Level 5)
**Project appraisal and technical evaluation**
- **Permissions**: project_appraisal, district_coordination
- **Dashboard Route**: `/dashboard/district-pacc`
- **Access**: Project proposals, technical evaluation data, approval workflows

### 7. Implementing Agency User (Level 4)
**Project execution and milestone management**
- **Permissions**: project_management, contractor_updates
- **Dashboard Route**: `/dashboard/implementing-agency`
- **Access**: Assigned projects, task updates, milestone uploads, evidence submission

### 8. Gram Panchayat User (Level 3) - Default Role
**Village-level program implementation**
- **Permissions**: village_verification, project_management
- **Dashboard Route**: `/dashboard/gram-panchayat`
- **Access**: Beneficiary verification, local project progress, field reports

### 9. Contractor/Vendor (Level 2)
**Contract execution and deliverable management**
- **Permissions**: contractor_updates, project_management
- **Dashboard Route**: `/dashboard/contractor`
- **Access**: Progress updates, deliverables, assigned task details

### 10. Auditor/Oversight (Level 8 - Special)
**Compliance monitoring and audit management**
- **Permissions**: audit_access, read_all_data
- **Dashboard Route**: `/dashboard/auditor`
- **Access**: Complete project data, logs, compliance documentation (read-only)

### 11. Technical Support Group (Level 6)
**System maintenance and user support**
- **Permissions**: system_support, manage_users
- **Dashboard Route**: `/dashboard/tech-support`
- **Access**: System support, user management assistance, system health monitoring

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "gram_panchayat_user", // optional, defaults to gram_panchayat_user
  "jurisdiction": {
    "state": "State Name",
    "district": "District Name",
    "block": "Block Name",
    "village": "Village Name"
  },
  "department": "Department Name",
  "agency": "Agency Name"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "dashboardRoute": "/dashboard/gram-panchayat",
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "gram_panchayat_user",
      "jurisdiction": {...},
      "permissions": ["village_verification", "project_management"]
    }
  }
}
```

#### Get Dashboard Route
```
GET /api/auth/dashboard-route
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "dashboardRoute": "/dashboard/gram-panchayat",
    "role": "gram_panchayat_user",
    "permissions": ["village_verification", "project_management"],
    "jurisdiction": {...}
  }
}
```

#### Update User Role (Super Admin Only)
```
PUT /api/auth/role/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "district_collector",
  "jurisdiction": {
    "state": "State Name",
    "district": "District Name"
  },
  "department": "Revenue Department",
  "agency": "District Administration"
}
```

### User Management Endpoints

#### Get All Users
```
GET /api/users
Authorization: Bearer <token>
Roles: super_admin, central_admin, technical_support_group
```

#### Create User (Super Admin Only)
```
POST /api/users
Authorization: Bearer <token>
Role: super_admin
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "district_collector",
  "jurisdiction": {
    "state": "State Name",
    "district": "District Name"
  }
}
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer <token>
Access: Own profile or admin permissions
```

#### Update User
```
PUT /api/users/:id
Authorization: Bearer <token>
Access: Own profile (limited fields) or admin permissions (all fields)
```

#### Delete User (Super Admin Only)
```
DELETE /api/users/:id
Authorization: Bearer <token>
Role: super_admin
```

### Dashboard Endpoints

#### Get Dashboard Data
```
GET /api/dashboard/data
Authorization: Bearer <token>

Response: Role-specific dashboard data including stats, charts, and recent activities
```

#### Get Dashboard Widgets
```
GET /api/dashboard/widgets
Authorization: Bearer <token>

Response: Array of widgets available for the user's role
```

#### Get Dashboard Navigation
```
GET /api/dashboard/navigation
Authorization: Bearer <token>

Response: Navigation menu items based on user's role and permissions
```

#### Role-Specific Dashboard Routes
```
GET /api/dashboard/super-admin          // Super Admin only
GET /api/dashboard/central-admin        // Central Admin only
GET /api/dashboard/state-nodal          // State Nodal Admin only
GET /api/dashboard/state-sc-corp        // State SC Corporation Admin only
GET /api/dashboard/district-collector   // District Collector only
GET /api/dashboard/district-pacc        // District PACC Admin only
GET /api/dashboard/implementing-agency  // Implementing Agency User only
GET /api/dashboard/gram-panchayat       // Gram Panchayat User only
GET /api/dashboard/contractor           // Contractor/Vendor only
GET /api/dashboard/auditor              // Auditor/Oversight only
GET /api/dashboard/tech-support         // Technical Support Group only
```

### Data Access Endpoints (Role-Based)

#### Beneficiary Data
```
GET /api/users/beneficiaries/all
Authorization: Bearer <token>
Roles: super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, gram_panchayat_user
Jurisdiction: Enforced based on user's jurisdiction
```

#### Project Data
```
GET /api/users/projects/state/:state
GET /api/users/projects/district/:district
Authorization: Bearer <token>
Roles: super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin, implementing_agency_user
Jurisdiction: Enforced based on user's jurisdiction
```

#### Financial Data
```
GET /api/users/financial/state/:state
Authorization: Bearer <token>
Roles: super_admin, central_admin, state_nodal_admin, auditor_oversight
Minimum Level: 8
```

#### Audit Data
```
GET /api/users/audit/logs
Authorization: Bearer <token>
Roles: super_admin, auditor_oversight
```

## Middleware

### Role Authorization
- `requireRole(roles)` - Checks if user has one of the specified roles
- `requirePermission(permissions)` - Checks if user has required permissions
- `requireMinLevel(level)` - Checks if user meets minimum hierarchy level
- `requireJurisdiction(type)` - Checks jurisdiction-based access
- `canAccessData(dataType)` - Checks data access permissions
- `addUserContext` - Adds user context (role, permissions, jurisdiction) to request

### Usage Examples
```javascript
// Require specific role
router.get('/admin-only', requireRole('super_admin'), controller);

// Require multiple roles
router.get('/state-data', requireRole(['super_admin', 'central_admin', 'state_nodal_admin']), controller);

// Require specific permission
router.post('/approve-project', requirePermission('approve_projects'), controller);

// Require minimum hierarchy level
router.get('/high-level-data', requireMinLevel(8), controller);

// Require jurisdiction access
router.get('/state/:state/data', requireJurisdiction('state'), controller);

// Check data access permissions
router.get('/beneficiary-data', canAccessData('beneficiary_data'), controller);
```

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### Authorization Errors
```json
{
  "success": false,
  "message": "Insufficient permissions for this role"
}
```

### Jurisdiction Errors
```json
{
  "success": false,
  "message": "Access denied for state: StateName",
  "userJurisdiction": "UserStateName"
}
```

## Client Integration

### Frontend Implementation
1. Store JWT token and user data from login response
2. Use `dashboardRoute` to redirect user to appropriate dashboard
3. Check user `permissions` array to show/hide UI elements
4. Use role-specific API endpoints based on user's role
5. Handle different dashboard components based on user role

### Dashboard Components by Role

Each role has specific dashboard components:
- **Super Admin**: User management, system overview, audit logs, financial summary
- **Central Admin**: National overview, state performance, fund management
- **State Nodal Admin**: State overview, district performance, project approval
- **District Collector**: District overview, project coordination
- **Gram Panchayat User**: Village projects, beneficiary verification

## Security Features

1. **Hierarchy-Based Access**: Higher-level roles can access lower-level data
2. **Jurisdiction Enforcement**: Users can only access data within their jurisdiction
3. **Permission-Based UI**: Frontend can hide/show features based on permissions
4. **Audit Trail**: All actions are logged for compliance
5. **Role Isolation**: Each role has specific, limited access to required features
6. **Data Segregation**: Data access is role and jurisdiction specific

## Development Notes

- Default role for new registrations: `gram_panchayat_user`
- Email verification removed for streamlined onboarding
- Role changes require Super Admin permissions
- All dashboard data endpoints return role-specific information
- Middleware automatically enforces jurisdiction and permission checks
- System designed for horizontal scaling with role-based data partitioning