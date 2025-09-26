# PM-AJAY Project Management API Documentation

## Overview
This API provides comprehensive project management capabilities for the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojna) system, including project tracking, milestone management, progress updates, fund management, and beneficiary tracking.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Projects API

#### GET /api/projects
Get all projects with filtering and pagination
- **Query Parameters:**
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `status` (string): Filter by project status
  - `schemeType` (string): Filter by scheme type
  - `state` (string): Filter by state
  - `district` (string): Filter by district
  - `priority` (string): Filter by priority
  - `search` (string): Search in project name/description/ID

#### POST /api/projects
Create a new project
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin
- **Body:** Project object with required fields

#### GET /api/projects/:projectId
Get single project by ID

#### PUT /api/projects/:projectId
Update project
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector

#### DELETE /api/projects/:projectId
Delete project
- **Required Roles:** super_admin, central_admin

#### GET /api/projects/:projectId/dashboard
Get project dashboard data with aggregated statistics

### 2. Milestones API

#### GET /api/projects/:projectId/milestones
Get all milestones for a project
- **Query Parameters:**
  - `status` (string): Filter by milestone status
  - `category` (string): Filter by milestone category
  - `sortBy` (string): Sort field (default: scheduledDate)

#### POST /api/projects/:projectId/milestones
Create new milestone
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin, implementing_agency_user

#### GET /api/projects/:projectId/milestones/timeline
Get milestone timeline for project

#### GET /api/projects/:projectId/milestones/overdue
Get overdue milestones

#### GET /api/projects/:projectId/milestones/:milestoneId
Get single milestone

#### PUT /api/projects/:projectId/milestones/:milestoneId
Update milestone
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin, implementing_agency_user

#### DELETE /api/projects/:projectId/milestones/:milestoneId
Delete milestone
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector

#### POST /api/projects/:projectId/milestones/:milestoneId/verify
Verify milestone completion
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, auditor_oversight

### 3. Progress Updates API

#### GET /api/projects/:projectId/progress
Get progress updates for project
- **Query Parameters:**
  - `page`, `limit`: Pagination
  - `updateType`: Filter by update type
  - `startDate`, `endDate`: Date range filter
  - `milestoneId`: Filter by milestone

#### POST /api/projects/:projectId/progress
Create new progress update
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin, implementing_agency_user, gram_panchayat_user, contractor_vendor

#### GET /api/projects/:projectId/progress/summary
Get project progress summary with statistics

#### GET /api/projects/:projectId/progress/issues
Get issues for project

#### GET /api/projects/:projectId/progress/:updateId
Get single progress update

#### PUT /api/projects/:projectId/progress/:updateId
Update progress update
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, implementing_agency_user, gram_panchayat_user, contractor_vendor

#### DELETE /api/projects/:projectId/progress/:updateId
Delete progress update
- **Required Roles:** super_admin, central_admin

### 4. Fund Management API

#### GET /api/projects/:projectId/funds
Get fund transactions for project
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin, auditor_oversight
- **Query Parameters:**
  - `page`, `limit`: Pagination
  - `transactionType`: Filter by transaction type
  - `status`: Filter by status
  - `startDate`, `endDate`: Date range filter

#### POST /api/projects/:projectId/funds
Create new fund transaction
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin

#### GET /api/projects/:projectId/funds/summary
Get project fund summary

#### GET /api/funds/pending-approvals
Get pending approvals for user
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin

#### GET /api/projects/:projectId/funds/:fundId
Get single fund transaction

#### PUT /api/projects/:projectId/funds/:fundId
Update fund transaction
- **Required Roles:** super_admin, central_admin, state_nodal_admin, district_collector, district_pacc_admin

#### POST /api/projects/:projectId/funds/:fundId/approve
Approve/reject fund transaction
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin

### 5. Beneficiaries API

#### GET /api/projects/:projectId/beneficiaries
Get beneficiaries for project
- **Query Parameters:**
  - `page`, `limit`: Pagination
  - `verificationStatus`: Filter by verification status
  - `category`: Filter by category
  - `search`: Search in name/aadhaar/ID

#### POST /api/projects/:projectId/beneficiaries
Create new beneficiary
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin, gram_panchayat_user

#### GET /api/projects/:projectId/beneficiaries/stats
Get beneficiary statistics

#### GET /api/projects/:projectId/beneficiaries/:beneficiaryId
Get single beneficiary

#### PUT /api/projects/:projectId/beneficiaries/:beneficiaryId
Update beneficiary
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, district_pacc_admin, gram_panchayat_user

#### POST /api/projects/:projectId/beneficiaries/:beneficiaryId/verify
Verify beneficiary
- **Required Roles:** super_admin, central_admin, state_nodal_admin, state_sc_corporation_admin, district_collector, gram_panchayat_user

#### DELETE /api/projects/:projectId/beneficiaries/:beneficiaryId
Delete beneficiary
- **Required Roles:** super_admin, central_admin

## Data Models

### Project Model
```json
{
  "projectId": "string (unique)",
  "schemeType": "Adarsh Gram | GIA | Hostel | Rural Development | Infrastructure",
  "projectName": "string",
  "projectDescription": "string",
  "location": {
    "state": "string",
    "district": "string",
    "block": "string",
    "village": "string",
    "coordinates": {
      "latitude": "number",
      "longitude": "number"
    }
  },
  "financials": {
    "estimatedCost": "number",
    "sanctionedAmount": "number",
    "totalReleased": "number",
    "totalUtilized": "number"
  },
  "timeline": {
    "startDate": "date",
    "scheduledEndDate": "date",
    "actualEndDate": "date"
  },
  "status": "Planned | In Progress | Completed | On Hold | Cancelled",
  "priority": "High | Medium | Low",
  "assignedAgencies": {
    "implementingAgency": "string",
    "contractorId": "string",
    "supervisingOfficer": "string"
  },
  "approvals": {
    "districtApprovalStatus": "Pending | Approved | Rejected",
    "stateApprovalStatus": "Pending | Approved | Rejected",
    "centralApprovalStatus": "Pending | Approved | Rejected",
    "approvalDate": "date"
  }
}
```

### Milestone Model
```json
{
  "milestoneId": "string (unique)",
  "projectId": "ObjectId (ref: Project)",
  "milestoneName": "string",
  "description": "string",
  "category": "Planning | Execution | Completion",
  "scheduledDate": "date",
  "actualCompletionDate": "date",
  "status": "Pending | In Progress | Completed | Delayed",
  "dependencies": ["ObjectId (ref: Milestone)"],
  "evidence": {
    "documents": ["string (URLs)"],
    "photos": ["string (URLs)"],
    "reports": ["string (URLs)"]
  },
  "completionPercentage": "number (0-100)",
  "remarks": "string",
  "verifiedBy": "ObjectId (ref: User)",
  "verificationDate": "date"
}
```

### Progress Update Model
```json
{
  "updateId": "string (unique)",
  "projectId": "ObjectId (ref: Project)",
  "milestoneId": "ObjectId (ref: Milestone)",
  "updateDate": "date",
  "updatedBy": "ObjectId (ref: User)",
  "updateType": "Progress | Issue | Completion | Delay | Quality Check",
  "workCompleted": {
    "description": "string",
    "quantitativeMetrics": {
      "percentageCompleted": "number (0-100)",
      "unitsCompleted": "number",
      "measurementUnit": "string"
    }
  },
  "evidence": {
    "beforePhotos": ["string (URLs)"],
    "afterPhotos": ["string (URLs)"],
    "documents": ["string (URLs)"]
  },
  "issues": [{
    "issueType": "Technical | Financial | Administrative | Environmental | Social",
    "description": "string",
    "severity": "Low | Medium | High | Critical",
    "resolutionStatus": "Open | In Progress | Resolved | Closed",
    "resolutionDate": "date",
    "assignedTo": "ObjectId (ref: User)"
  }],
  "nextSteps": "string",
  "resourcesUsed": {
    "materials": [{
      "name": "string",
      "quantity": "number",
      "unit": "string",
      "cost": "number"
    }],
    "manpower": {
      "skilled": "number",
      "unskilled": "number",
      "supervisory": "number"
    },
    "equipment": [{
      "name": "string",
      "hours": "number",
      "cost": "number"
    }]
  },
  "qualityParameters": {
    "rating": "number (1-5)",
    "remarks": "string",
    "checkedBy": "ObjectId (ref: User)"
  }
}
```

### Fund Management Model
```json
{
  "transactionId": "string (unique)",
  "projectId": "ObjectId (ref: Project)",
  "transactionType": "Release | Utilization | Refund | Transfer",
  "amount": "number",
  "transactionDate": "date",
  "sourceAgency": "string",
  "destinationAgency": "string",
  "approvedBy": "ObjectId (ref: User)",
  "purpose": "string",
  "utilizationDetails": {
    "category": "Material | Labor | Equipment | Administrative | Contingency",
    "description": "string",
    "invoiceNumber": "string",
    "vendorDetails": {
      "name": "string",
      "contactInfo": "string",
      "gstNumber": "string"
    },
    "items": [{
      "description": "string",
      "quantity": "number",
      "rate": "number",
      "amount": "number"
    }]
  },
  "status": "Approved | Pending | Rejected | In Transit | Completed",
  "approvalWorkflow": [{
    "level": "District | State | Central",
    "approver": "ObjectId (ref: User)",
    "status": "Pending | Approved | Rejected",
    "comments": "string",
    "timestamp": "date"
  }],
  "attachments": [{
    "fileName": "string",
    "fileUrl": "string",
    "fileType": "string",
    "uploadedBy": "ObjectId (ref: User)",
    "uploadDate": "date"
  }],
  "remarks": "string",
  "auditTrail": [{
    "action": "string",
    "performedBy": "ObjectId (ref: User)",
    "timestamp": "date",
    "details": "string"
  }]
}
```

### Beneficiary Model
```json
{
  "beneficiaryId": "string (unique)",
  "projectId": "ObjectId (ref: Project)",
  "personalInfo": {
    "name": "string",
    "aadhaarNumber": "string (12 digits, unique)",
    "category": "SC | ST | General | OBC",
    "gender": "Male | Female | Other",
    "age": "number (0-120)",
    "contactNumber": "string (10 digits)",
    "address": "string"
  },
  "eligibilityCriteria": {
    "incomeLevel": "BPL | APL | AAY",
    "familySize": "number",
    "landOwnership": "Landless | Marginal | Small | Medium | Large"
  },
  "benefitsReceived": [{
    "benefitType": "string",
    "amount": "number",
    "dateReceived": "date",
    "status": "Approved | Disbursed | Pending | Rejected"
  }],
  "verificationStatus": "Verified | Pending | Rejected",
  "verifiedBy": "ObjectId (ref: User)",
  "registrationDate": "date"
}
```

## Error Handling

All API endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Role-Based Access Control

The system supports 11 different roles with specific permissions:

1. **super_admin** - Full system access
2. **central_admin** - Central level administration
3. **state_nodal_admin** - State level project management
4. **state_sc_corporation_admin** - State SC corporation management
5. **district_collector** - District level coordination
6. **district_pacc_admin** - District PACC administration
7. **implementing_agency_user** - Project implementation
8. **gram_panchayat_user** - Village level operations
9. **contractor_vendor** - Contractor operations
10. **auditor_oversight** - Audit and compliance
11. **technical_support_group** - System support

## Database Indexing

The system uses optimized MongoDB indexes for efficient querying:
- Unique indexes on ID fields
- Compound indexes for common filter combinations
- Date indexes for time-based queries
- Location indexes for geographical filtering
- Status indexes for workflow queries

## Getting Started

1. Ensure MongoDB is running
2. Install dependencies: `npm install`
3. Create indexes: `node createIndexes.js`
4. Start server: `npm start`
5. Test with role-based authentication using seeded users

## Support

For technical support or questions about the API, contact the development team.