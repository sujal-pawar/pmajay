const FundManagement = require('../models/FundManagement');
const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

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
    'central_admin': 'Central',
    'super_admin': 'Central'
  };
  
  return levelMap[user.role] || null;
}