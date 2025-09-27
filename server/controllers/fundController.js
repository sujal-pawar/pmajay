const FundManagement = require('../models/FundManagement');
const Project = require('../models/Project');

// Get fund transactions for a project
exports.getFundsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      transactionType, 
      status,
      startDate,
      endDate 
    } = req.query;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!hasProjectFundAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view fund details for this project'
      });
    }

    // Build query
    const query = { projectId };
    if (transactionType) query.transactionType = transactionType;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { transactionDate: -1 },
      populate: [
        { path: 'approvedBy', select: 'name email role' },
        { path: 'approvalWorkflow.approver', select: 'name email role' },
        { path: 'attachments.uploadedBy', select: 'name email' },
        { path: 'auditTrail.performedBy', select: 'name email role' }
      ]
    };

    const fundTransactions = await FundManagement.paginate(query, options);

    res.status(200).json({
      success: true,
      data: fundTransactions,
      message: 'Fund transactions retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fund transactions',
      error: error.message
    });
  }
};

// Get single fund transaction
exports.getFundById = async (req, res) => {
  try {
    const fundTransaction = await FundManagement.findById(req.params.fundId)
      .populate('projectId', 'projectName projectId')
      .populate('approvedBy', 'name email role')
      .populate('approvalWorkflow.approver', 'name email role')
      .populate('attachments.uploadedBy', 'name email')
      .populate('auditTrail.performedBy', 'name email role');

    if (!fundTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Fund transaction not found'
      });
    }

    // Check permissions
    if (!hasProjectFundAccess(req.user, fundTransaction.projectId)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view this fund transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: fundTransaction,
      message: 'Fund transaction retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fund transaction',
      error: error.message
    });
  }
};

// Create new fund transaction
exports.createFundTransaction = async (req, res) => {
  try {
    // Dynamic import for uuid (ES module)
    const { v4: uuidv4 } = await import('uuid');
    
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canManageFunds(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create fund transactions for this project'
      });
    }

    const transactionData = {
      ...req.body,
      projectId,
      transactionId: req.body.transactionId || `TXN-${Date.now()}-${uuidv4().substr(0, 8)}`,
      approvedBy: req.user._id
    };

    // Add initial audit trail entry
    transactionData.auditTrail = [{
      action: 'Transaction Created',
      performedBy: req.user._id,
      details: `Transaction created for ${transactionData.transactionType}`
    }];

    // Set up approval workflow based on amount
    if (transactionData.amount >= 100000) { // High value transactions
      transactionData.approvalWorkflow = [
        {
          level: 'District',
          status: 'Pending'
        },
        {
          level: 'State',
          status: 'Pending'
        },
        {
          level: 'Central',
          status: 'Pending'
        }
      ];
      transactionData.status = 'Pending';
    } else {
      transactionData.status = 'Approved';
    }

    const fundTransaction = new FundManagement(transactionData);
    await fundTransaction.save();

    // Update project financials
    await updateProjectFinancials(project, fundTransaction);

    await fundTransaction.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'approvedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      data: fundTransaction,
      message: 'Fund transaction created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating fund transaction',
      error: error.message
    });
  }
};

// Update fund transaction
exports.updateFundTransaction = async (req, res) => {
  try {
    const fundTransaction = await FundManagement.findById(req.params.fundId)
      .populate('projectId');
    
    if (!fundTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Fund transaction not found'
      });
    }

    // Check permissions
    if (!canManageFunds(req.user, fundTransaction.projectId)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this fund transaction'
      });
    }

    // Add audit trail entry
    fundTransaction.addAuditEntry(
      'Transaction Updated',
      req.user._id,
      `Transaction updated by ${req.user.name}`
    );

    // Update transaction
    Object.assign(fundTransaction, req.body);
    await fundTransaction.save();

    await fundTransaction.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'approvedBy', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      data: fundTransaction,
      message: 'Fund transaction updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating fund transaction',
      error: error.message
    });
  }
};

// Approve fund transaction
exports.approveFundTransaction = async (req, res) => {
  try {
    const fundTransaction = await FundManagement.findById(req.params.fundId)
      .populate('projectId');
    
    if (!fundTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Fund transaction not found'
      });
    }

    // Check if user can approve at their level
    const approvalLevel = getUserApprovalLevel(req.user);
    if (!approvalLevel) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to approve fund transactions'
      });
    }

    // Find the appropriate workflow step
    const workflowStep = fundTransaction.approvalWorkflow.find(
      step => step.level === approvalLevel && step.status === 'Pending'
    );

    if (!workflowStep) {
      return res.status(400).json({
        success: false,
        message: 'No pending approval at your level or already processed'
      });
    }

    // Update workflow step
    workflowStep.approver = req.user._id;
    workflowStep.status = req.body.action || 'Approved';
    workflowStep.comments = req.body.comments;
    workflowStep.timestamp = new Date();

    // Add audit trail
    fundTransaction.addAuditEntry(
      `${workflowStep.status} at ${approvalLevel} Level`,
      req.user._id,
      req.body.comments || `${workflowStep.status} by ${req.user.name}`
    );

    // Check if all approvals are complete
    const allApproved = fundTransaction.approvalWorkflow.every(
      step => step.status === 'Approved'
    );
    const anyRejected = fundTransaction.approvalWorkflow.some(
      step => step.status === 'Rejected'
    );

    if (anyRejected) {
      fundTransaction.status = 'Rejected';
    } else if (allApproved) {
      fundTransaction.status = 'Approved';
      // Update project financials when fully approved
      await updateProjectFinancials(fundTransaction.projectId, fundTransaction);
    }

    await fundTransaction.save();

    await fundTransaction.populate([
      { path: 'approvalWorkflow.approver', select: 'name email role' },
      { path: 'auditTrail.performedBy', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      data: fundTransaction,
      message: `Fund transaction ${workflowStep.status.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error processing fund transaction approval',
      error: error.message
    });
  }
};

// Get project fund summary
exports.getProjectFundSummary = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!hasProjectFundAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view fund summary'
      });
    }

    // Aggregate fund data
    const fundSummary = await FundManagement.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: '$transactionType',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    const statusSummary = await FundManagement.aggregate([
      { $match: { projectId: project._id } },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      project: {
        name: project.projectName,
        id: project.projectId,
        estimatedCost: project.financials.estimatedCost,
        sanctionedAmount: project.financials.sanctionedAmount,
        totalReleased: project.financials.totalReleased,
        totalUtilized: project.financials.totalUtilized
      },
      transactionSummary: fundSummary,
      statusSummary: statusSummary,
      utilizationPercentage: project.progressPercentage
    };

    res.status(200).json({
      success: true,
      data: summary,
      message: 'Project fund summary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project fund summary',
      error: error.message
    });
  }
};

// Get pending approvals for user
exports.getPendingApprovals = async (req, res) => {
  try {
    const approvalLevel = getUserApprovalLevel(req.user);
    if (!approvalLevel) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No approval permissions'
      });
    }

    const pendingApprovals = await FundManagement.find({
      'approvalWorkflow': {
        $elemMatch: {
          level: approvalLevel,
          status: 'Pending'
        }
      }
    })
    .populate('projectId', 'projectName projectId location')
    .populate('approvedBy', 'name email role')
    .sort({ transactionDate: 1 });

    res.status(200).json({
      success: true,
      data: pendingApprovals,
      count: pendingApprovals.length,
      message: 'Pending approvals retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving pending approvals',
      error: error.message
    });
  }
};

// Helper functions
async function updateProjectFinancials(project, transaction) {
  switch (transaction.transactionType) {
    case 'Release':
      project.financials.totalReleased += transaction.amount;
      break;
    case 'Utilization':
      project.financials.totalUtilized += transaction.amount;
      break;
    case 'Refund':
      project.financials.totalUtilized -= transaction.amount;
      break;
  }
  await project.save();
}

function hasProjectFundAccess(user, project) {
  if (['super_admin', 'central_admin'].includes(user.role)) {
    return true;
  }
  
  if (['state_nodal_admin', 'state_sc_corporation_admin'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state;
  }
  
  if (['district_collector', 'district_pacc_admin'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state &&
           user.jurisdiction.district === project.location.district;
  }
  
  return false;
}

function canManageFunds(user, project) {
  return hasProjectFundAccess(user, project) && 
         ['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'district_pacc_admin'].includes(user.role);
}

function getUserApprovalLevel(user) {
  const levelMap = {
    'district_collector': 'District',
    'district_pacc_admin': 'District',
    'state_nodal_admin': 'State',
    'state_sc_corporation_admin': 'State',
    'state_treasury': 'State',
    'central_admin': 'Central',
    'super_admin': 'Central'
  };
  
  return levelMap[user.role] || null;
}

// @desc    Initiate automatic fund flow from center to state
// @route   POST /api/funds/initiate-central-release
// @access  Private (Central Admin only)
exports.initiateCentralRelease = async (req, res) => {
  try {
    const { projectId, amount, purpose, milestoneId } = req.body;
    
    // Only central admin can initiate central releases
    if (!['super_admin', 'central_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only central administrators can initiate central fund releases'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Create fund release from Central to State Treasury
    const centralRelease = await FundManagement.create({
      transactionId: `CR-${Date.now()}-${require('crypto').randomBytes(4).toString('hex')}`,
      projectId,
      milestoneId,
      transactionType: 'Release',
      amount,
      transactionDate: new Date(),
      sourceAgency: 'Central Government',
      destinationAgency: 'State Treasury',
      approvedBy: req.user._id,
      purpose: purpose || 'Central fund release to state treasury',
      status: 'Completed',
      pfmsReferenceNumber: `PFMS-CR-${Date.now()}`,
      utilizationDetails: {
        category: 'Central Release',
        description: purpose || 'Fund release from central government to state treasury'
      },
      auditTrail: [{
        action: 'Central Release Initiated',
        performedBy: req.user._id,
        details: `Central release of ₹${amount} initiated for project ${project.projectName}`
      }]
    });

    // Update project financials
    project.financials.totalReleased += amount;
    await project.save();

    // Automatically trigger State Treasury notification for further processing
    await createStateNotification(project, centralRelease);

    res.status(201).json({
      success: true,
      data: centralRelease,
      message: 'Central fund release initiated successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating central fund release',
      error: error.message
    });
  }
};

// @desc    Process state treasury fund flow to implementing agencies
// @route   POST /api/funds/process-state-release
// @access  Private (State Treasury only)
exports.processStateRelease = async (req, res) => {
  try {
    const { projectId, milestoneId, amount, destinationAgency } = req.body;
    
    // Only state treasury can process state releases
    if (req.user.role !== 'state_treasury') {
      return res.status(403).json({
        success: false,
        message: 'Only state treasury officials can process state fund releases'
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if state treasury has received funds for this project
    const availableFunds = await checkAvailableStateFunds(projectId);
    if (availableFunds < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds available. Available: ₹${availableFunds}, Requested: ₹${amount}`
      });
    }

    // Create fund release from State Treasury to Implementing Agency
    const stateRelease = await FundManagement.create({
      transactionId: `SR-${Date.now()}-${require('crypto').randomBytes(4).toString('hex')}`,
      projectId,
      milestoneId,
      transactionType: 'Release',
      amount,
      transactionDate: new Date(),
      sourceAgency: 'State Treasury',
      destinationAgency: destinationAgency || project.assignedAgencies?.implementingAgency || 'Implementing Agency',
      approvedBy: req.user._id,
      purpose: `State treasury release for milestone completion`,
      status: 'Completed',
      pfmsReferenceNumber: `PFMS-SR-${Date.now()}`,
      utilizationDetails: {
        category: 'State Release',
        description: `Fund release from state treasury to implementing agency for milestone completion`
      },
      auditTrail: [{
        action: 'State Release Processed',
        performedBy: req.user._id,
        details: `State treasury released ₹${amount} to ${destinationAgency} for project ${project.projectName}`
      }]
    });

    // Update project financials
    project.financials.totalReleased += amount;
    await project.save();

    res.status(201).json({
      success: true,
      data: stateRelease,
      message: 'State fund release processed successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing state fund release',
      error: error.message
    });
  }
};

// @desc    Get fund flow status for a project
// @route   GET /api/funds/flow-status/:projectId
// @access  Private
exports.getFundFlowStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!hasProjectFundAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view fund flow status'
      });
    }

    // Get fund flow transactions
    const fundFlow = await FundManagement.find({ projectId })
      .populate('milestoneId', 'milestoneName category status')
      .sort({ transactionDate: 1 });

    // Calculate flow summary
    const flowSummary = {
      centralToState: 0,
      stateToAgency: 0,
      totalUtilized: 0,
      pendingReleases: 0
    };

    const flowDetails = [];

    fundFlow.forEach(transaction => {
      if (transaction.sourceAgency === 'Central Government' && transaction.destinationAgency === 'State Treasury') {
        flowSummary.centralToState += transaction.amount;
      } else if (transaction.sourceAgency === 'State Treasury') {
        flowSummary.stateToAgency += transaction.amount;
      }

      if (transaction.transactionType === 'Utilization') {
        flowSummary.totalUtilized += transaction.amount;
      }

      if (transaction.status === 'Pending') {
        flowSummary.pendingReleases += transaction.amount;
      }

      flowDetails.push({
        date: transaction.transactionDate,
        from: transaction.sourceAgency,
        to: transaction.destinationAgency,
        amount: transaction.amount,
        type: transaction.transactionType,
        status: transaction.status,
        milestone: transaction.milestoneId?.milestoneName,
        reference: transaction.pfmsReferenceNumber
      });
    });

    res.status(200).json({
      success: true,
      data: {
        project: {
          name: project.projectName,
          id: project.projectId,
          sanctionedAmount: project.financials.sanctionedAmount,
          totalReleased: project.financials.totalReleased,
          totalUtilized: project.financials.totalUtilized
        },
        flowSummary,
        flowDetails
      },
      message: 'Fund flow status retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving fund flow status',
      error: error.message
    });
  }
};

// @desc    Get state treasury dashboard data
// @route   GET /api/funds/state-treasury-dashboard
// @access  Private (State Treasury only)
exports.getStateTreasuryDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'state_treasury') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to state treasury officials'
      });
    }

    const state = req.user.jurisdiction?.state;
    
    // Get dashboard data
    const dashboardData = {
      fundsSummary: await getStateFundsSummary(state),
      recentTransactions: await getRecentStateTransactions(state),
      pendingReleases: await getPendingStateReleases(state),
      pfmsIntegration: await getPFMSIntegrationStatus(state),
      auditCompliance: await getAuditComplianceData(state)
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
      message: 'State treasury dashboard data retrieved successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving state treasury dashboard data',
      error: error.message
    });
  }
};

// Helper functions for fund flow automation
async function checkAvailableStateFunds(projectId) {
  const received = await FundManagement.aggregate([
    {
      $match: {
        projectId: require('mongoose').Types.ObjectId(projectId),
        destinationAgency: 'State Treasury',
        status: 'Completed'
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const released = await FundManagement.aggregate([
    {
      $match: {
        projectId: require('mongoose').Types.ObjectId(projectId),
        sourceAgency: 'State Treasury',
        status: 'Completed'
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const totalReceived = received[0]?.total || 0;
  const totalReleased = released[0]?.total || 0;
  
  return totalReceived - totalReleased;
}

async function createStateNotification(project, centralRelease) {
  // This would typically integrate with a notification system
  console.log(`State Treasury Notification: ₹${centralRelease.amount} received for project ${project.projectName}`);
  
  // You could add database notification record here
  // const Notification = require('../models/Notification');
  // await Notification.create({...});
}

async function getStateFundsSummary(state) {
  const summary = await FundManagement.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $match: {
        'project.location.state': state
      }
    },
    {
      $group: {
        _id: {
          sourceAgency: '$sourceAgency',
          destinationAgency: '$destinationAgency',
          status: '$status'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return summary;
}

async function getRecentStateTransactions(state) {
  const transactions = await FundManagement.find()
    .populate({
      path: 'projectId',
      match: { 'location.state': state },
      select: 'projectName projectId location'
    })
    .populate('approvedBy', 'name role')
    .sort({ transactionDate: -1 })
    .limit(20);

  return transactions.filter(t => t.projectId); // Filter out null populated projects
}

async function getPendingStateReleases(state) {
  const pending = await FundManagement.find({
    sourceAgency: 'State Treasury',
    status: 'Pending'
  })
  .populate({
    path: 'projectId',
    match: { 'location.state': state },
    select: 'projectName projectId location'
  })
  .populate('milestoneId', 'milestoneName category');

  return pending.filter(p => p.projectId);
}

async function getPFMSIntegrationStatus(state) {
  const pfmsData = await FundManagement.aggregate([
    {
      $lookup: {
        from: 'projects',
        localField: 'projectId',
        foreignField: '_id',
        as: 'project'
      }
    },
    {
      $match: {
        'project.location.state': state,
        pfmsReferenceNumber: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  return pfmsData;
}

async function getAuditComplianceData(state) {
  // Mock implementation - replace with actual audit data
  return {
    complianceRate: 94.5,
    lastAuditDate: new Date('2024-01-15'),
    pendingAudits: 3,
    resolvedIssues: 12
  };
}