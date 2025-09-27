// Define apiRequest function locally since it's not in permissions
const apiRequest = async (url: string, options: RequestInit = {}, token?: string): Promise<any> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Project {
  _id: string;
  projectId: string;
  schemeType: string;
  projectName: string;
  projectDescription: string;
  location: {
    state: string;
    district: string;
    block?: string;
    village?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  financials: {
    estimatedCost: number;
    sanctionedAmount: number;
    totalReleased: number;
    totalUtilized: number;
  };
  timeline: {
    startDate: string;
    scheduledEndDate: string;
    actualEndDate?: string;
  };
  status: string;
  priority: string;
  assignedAgencies?: {
    implementingAgency?: string;
    contractorId?: string;
    supervisingOfficer?: string;
  };
  approvals?: {
    districtApprovalStatus: string;
    stateApprovalStatus: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id: string;
  milestoneId: string;
  projectId: string;
  milestoneName: string;
  description: string;
  category: string;
  scheduledDate: string;
  actualCompletionDate?: string;
  status: string;
  completionPercentage: number;
  verificationStatus: string;
  verifiedBy?: string;
  verificationDate?: string;
  dependencies?: string[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressUpdate {
  _id: string;
  updateId: string;
  projectId: string;
  milestoneId?: string;
  updateDate: string;
  updatedBy: string;
  updateType: string;
  workCompleted: {
    description: string;
    quantitativeMetrics?: {
      percentageCompleted?: number;
      unitsCompleted?: number;
      measurementUnit?: string;
    };
  };
  evidence?: {
    beforePhotos?: string[];
    afterPhotos?: string[];
    documents?: string[];
  };
  issues?: Array<{
    issueType: string;
    description: string;
    severity: string;
    resolutionStatus: string;
    resolutionDate?: string;
    assignedTo?: string;
  }>;
  qualityParameters?: {
    rating?: number;
    remarks?: string;
    checkedBy?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  _id: string;
  beneficiaryId: string;
  projectId: string;
  personalInfo: {
    name: string;
    aadhaarNumber: string;
    category: string;
    gender: string;
    age: number;
    contactNumber?: string;
    address: string;
  };
  economicInfo: {
    annualIncome?: number;
    occupation?: string;
    bplCardNumber?: string;
  };
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  };
  eligibilityStatus: string;
  verificationDate?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundTransaction {
  _id: string;
  transactionId: string;
  projectId: string;
  transactionType: string;
  amount: number;
  transactionDate: string;
  sourceAgency: string;
  destinationAgency: string;
  approvedBy: string;
  purpose: string;
  utilizationDetails: {
    category: string;
    description?: string;
  };
  status: string;
  documents?: Array<{
    type: string;
    documentNumber?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Projects API
export const projectsApi = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    schemeType?: string;
    state?: string;
    district?: string;
    priority?: string;
    search?: string;
  }, token?: string): Promise<{ success: boolean; data: any; message: string }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url, {}, token);
  },

  async getById(projectId: string, token?: string): Promise<{ data: Project }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}`, {}, token);
  },

  async create(projectData: Partial<Project>, token?: string): Promise<{ data: Project }> {
    return apiRequest(`${API_BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(projectData),
    }, token);
  },

  async update(projectId: string, projectData: Partial<Project>, token?: string): Promise<{ data: Project }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }, token);
  },

  async delete(projectId: string, token?: string): Promise<void> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
    }, token);
  },

  async getDashboard(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/dashboard`, {}, token);
  },

  async getPendingPACCApprovals(params?: { page?: number; limit?: number }, token?: string): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/projects/pending-pacc-approval${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest(url, {}, token);
  },

  async makePACCDecision(projectId: string, decisionData: any, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/pacc-decision`, {
      method: 'POST',
      body: JSON.stringify(decisionData),
    }, token);
  }
};

// Milestones API
export const milestonesApi = {
  async getByProject(projectId: string, token?: string): Promise<{ data: Milestone[] }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones`, {}, token);
  },

  async getById(projectId: string, milestoneId: string, token?: string): Promise<{ data: Milestone }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}`, {}, token);
  },

  async create(projectId: string, milestoneData: Partial<Milestone>, token?: string): Promise<{ data: Milestone }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones`, {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    }, token);
  },

  async update(projectId: string, milestoneId: string, milestoneData: Partial<Milestone>, token?: string): Promise<{ data: Milestone }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(milestoneData),
    }, token);
  },

  async delete(projectId: string, milestoneId: string, token?: string): Promise<void> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'DELETE',
    }, token);
  },

  async verify(projectId: string, milestoneId: string, verificationData: any, token?: string): Promise<{ data: Milestone }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/${milestoneId}/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    }, token);
  },

  async getTimeline(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/timeline`, {}, token);
  },

  async getOverdue(projectId: string, token?: string): Promise<{ data: Milestone[] }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/milestones/overdue`, {}, token);
  }
};

// Progress Updates API
export const progressApi = {
  async getByProject(projectId: string, token?: string): Promise<{ data: ProgressUpdate[] }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress`, {}, token);
  },

  async getById(projectId: string, updateId: string, token?: string): Promise<{ data: ProgressUpdate }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress/${updateId}`, {}, token);
  },

  async create(projectId: string, progressData: Partial<ProgressUpdate>, token?: string): Promise<{ data: ProgressUpdate }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress`, {
      method: 'POST',
      body: JSON.stringify(progressData),
    }, token);
  },

  async update(projectId: string, updateId: string, progressData: Partial<ProgressUpdate>, token?: string): Promise<{ data: ProgressUpdate }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress/${updateId}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    }, token);
  },

  async delete(projectId: string, updateId: string, token?: string): Promise<void> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress/${updateId}`, {
      method: 'DELETE',
    }, token);
  },

  async getSummary(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress/summary`, {}, token);
  },

  async getIssues(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/progress/issues`, {}, token);
  }
};

// Beneficiaries API
export const beneficiariesApi = {
  async getByProject(projectId: string, token?: string): Promise<{ data: Beneficiary[] }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries`, {}, token);
  },

  async getById(projectId: string, beneficiaryId: string, token?: string): Promise<{ data: Beneficiary }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries/${beneficiaryId}`, {}, token);
  },

  async create(projectId: string, beneficiaryData: Partial<Beneficiary>, token?: string): Promise<{ data: Beneficiary }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries`, {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    }, token);
  },

  async update(projectId: string, beneficiaryId: string, beneficiaryData: Partial<Beneficiary>, token?: string): Promise<{ data: Beneficiary }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries/${beneficiaryId}`, {
      method: 'PUT',
      body: JSON.stringify(beneficiaryData),
    }, token);
  },

  async delete(projectId: string, beneficiaryId: string, token?: string): Promise<void> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries/${beneficiaryId}`, {
      method: 'DELETE',
    }, token);
  },

  async verify(projectId: string, beneficiaryId: string, verificationData: any, token?: string): Promise<{ data: Beneficiary }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries/${beneficiaryId}/verify`, {
      method: 'POST',
      body: JSON.stringify(verificationData),
    }, token);
  },

  async getStats(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/beneficiaries/stats`, {}, token);
  }
};

// Funds API
export const fundsApi = {
  async getByProject(projectId: string, token?: string): Promise<{ data: FundTransaction[] }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds`, {}, token);
  },

  async getById(projectId: string, fundId: string, token?: string): Promise<{ data: FundTransaction }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds/${fundId}`, {}, token);
  },

  async create(projectId: string, fundData: Partial<FundTransaction>, token?: string): Promise<{ data: FundTransaction }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds`, {
      method: 'POST',
      body: JSON.stringify(fundData),
    }, token);
  },

  async update(projectId: string, fundId: string, fundData: Partial<FundTransaction>, token?: string): Promise<{ data: FundTransaction }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds/${fundId}`, {
      method: 'PUT',
      body: JSON.stringify(fundData),
    }, token);
  },

  async approve(projectId: string, fundId: string, approvalData: any, token?: string): Promise<{ data: FundTransaction }> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds/${fundId}/approve`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    }, token);
  },

  async getSummary(projectId: string, token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/${projectId}/funds/summary`, {}, token);
  },

  async getPendingApprovals(token?: string): Promise<any> {
    return apiRequest(`${API_BASE_URL}/projects/funds/pending-approvals`, {}, token);
  }
};