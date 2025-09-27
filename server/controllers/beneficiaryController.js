const Beneficiary = require('../models/Beneficiary');
const Project = require('../models/Project');

// Get beneficiaries for a project
exports.getBeneficiariesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      verificationStatus, 
      category,
      search 
    } = req.query;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build query
    const query = { projectId };
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (category) query['personalInfo.category'] = category;
    if (search) {
      query.$or = [
        { 'personalInfo.name': { $regex: search, $options: 'i' } },
        { 'personalInfo.aadhaarNumber': { $regex: search, $options: 'i' } },
        { beneficiaryId: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { registrationDate: -1 },
      populate: [
        { path: 'verifiedBy', select: 'name email role' },
        { path: 'projectId', select: 'projectName projectId' }
      ]
    };

    const beneficiaries = await Beneficiary.paginate(query, options);

    res.status(200).json({
      success: true,
      data: beneficiaries,
      message: 'Beneficiaries retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving beneficiaries',
      error: error.message
    });
  }
};

// Get single beneficiary
exports.getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.beneficiaryId)
      .populate('projectId', 'projectName projectId')
      .populate('verifiedBy', 'name email role');

    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    res.status(200).json({
      success: true,
      data: beneficiary,
      message: 'Beneficiary retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving beneficiary',
      error: error.message
    });
  }
};

// Create new beneficiary
exports.createBeneficiary = async (req, res) => {
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
    if (!canManageBeneficiaries(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create beneficiaries for this project'
      });
    }

    const beneficiaryData = {
      ...req.body,
      projectId,
      beneficiaryId: req.body.beneficiaryId || `BEN-${Date.now()}-${uuidv4().substr(0, 6)}`
    };

    const beneficiary = new Beneficiary(beneficiaryData);
    await beneficiary.save();

    await beneficiary.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'verifiedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      data: beneficiary,
      message: 'Beneficiary created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.beneficiaryId) {
        return res.status(400).json({
          success: false,
          message: 'Beneficiary ID already exists'
        });
      }
      if (error.keyPattern['personalInfo.aadhaarNumber']) {
        return res.status(400).json({
          success: false,
          message: 'Aadhaar number already registered'
        });
      }
    }

    res.status(400).json({
      success: false,
      message: 'Error creating beneficiary',
      error: error.message
    });
  }
};

// Update beneficiary
exports.updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.beneficiaryId)
      .populate('projectId');
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Check permissions
    if (!canManageBeneficiaries(req.user, beneficiary.projectId)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this beneficiary'
      });
    }

    // Update beneficiary
    Object.assign(beneficiary, req.body);
    await beneficiary.save();

    await beneficiary.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'verifiedBy', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      data: beneficiary,
      message: 'Beneficiary updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating beneficiary',
      error: error.message
    });
  }
};

// Verify beneficiary
exports.verifyBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.beneficiaryId)
      .populate('projectId');
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Check if user can verify beneficiaries
    if (!canVerifyBeneficiaries(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to verify beneficiaries'
      });
    }

    const { verificationStatus, remarks } = req.body;

    beneficiary.verificationStatus = verificationStatus;
    beneficiary.verifiedBy = req.user._id;
    
    // Add verification entry to benefits if approved
    if (verificationStatus === 'Verified' && req.body.benefitDetails) {
      beneficiary.benefitsReceived.push({
        ...req.body.benefitDetails,
        dateReceived: new Date(),
        status: 'Approved'
      });
    }

    await beneficiary.save();
    await beneficiary.populate('verifiedBy', 'name email role');

    res.status(200).json({
      success: true,
      data: beneficiary,
      message: `Beneficiary ${verificationStatus.toLowerCase()} successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error verifying beneficiary',
      error: error.message
    });
  }
};

// Get beneficiary statistics
exports.getBeneficiaryStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Aggregate beneficiary statistics
    const [categoryStats, verificationStats, benefitStats] = await Promise.all([
      Beneficiary.aggregate([
        { $match: { projectId: project._id } },
        { $group: { _id: '$personalInfo.category', count: { $sum: 1 } } }
      ]),
      Beneficiary.aggregate([
        { $match: { projectId: project._id } },
        { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
      ]),
      Beneficiary.aggregate([
        { $match: { projectId: project._id } },
        { $unwind: '$benefitsReceived' },
        {
          $group: {
            _id: '$benefitsReceived.status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$benefitsReceived.amount' }
          }
        }
      ])
    ]);

    const stats = {
      project: {
        name: project.projectName,
        id: project.projectId
      },
      categoryDistribution: categoryStats,
      verificationStatus: verificationStats,
      benefitDistribution: benefitStats,
      totalBeneficiaries: await Beneficiary.countDocuments({ projectId })
    };

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Beneficiary statistics retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving beneficiary statistics',
      error: error.message
    });
  }
};

// Delete beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.beneficiaryId)
      .populate('projectId');
    
    if (!beneficiary) {
      return res.status(404).json({
        success: false,
        message: 'Beneficiary not found'
      });
    }

    // Check permissions - only admin roles can delete
    if (!['super_admin', 'central_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete beneficiaries'
      });
    }

    // Check if beneficiary has received benefits
    const hasReceivedBenefits = beneficiary.benefitsReceived.some(
      benefit => benefit.status === 'Disbursed'
    );

    if (hasReceivedBenefits) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete beneficiary who has received benefits'
      });
    }

    await Beneficiary.findByIdAndDelete(req.params.beneficiaryId);

    res.status(200).json({
      success: true,
      message: 'Beneficiary deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting beneficiary',
      error: error.message
    });
  }
};

// Helper functions
function canManageBeneficiaries(user, project) {
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
  
  if (user.role === 'gram_panchayat_user') {
    return user.jurisdiction.state === project.location.state &&
           user.jurisdiction.district === project.location.district &&
           user.jurisdiction.village === project.location.village;
  }
  
  return false;
}

function canVerifyBeneficiaries(user) {
  return ['super_admin', 'central_admin', 'state_nodal_admin', 'state_sc_corporation_admin', 'district_collector', 'gram_panchayat_user'].includes(user.role);
}