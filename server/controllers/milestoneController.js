const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

// Get all milestones for a project
exports.getMilestonesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, category, sortBy = 'scheduledDate' } = req.query;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build query
    const query = { projectId };
    if (status) query.status = status;
    if (category) query.category = category;

    const milestones = await Milestone.find(query)
      .populate('verifiedBy', 'name email role')
      .populate('dependencies', 'milestoneName status')
      .sort({ [sortBy]: 1 });

    res.status(200).json({
      success: true,
      data: milestones,
      message: 'Milestones retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving milestones',
      error: error.message
    });
  }
};

// Get single milestone
exports.getMilestoneById = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId', 'projectName projectId')
      .populate('verifiedBy', 'name email role')
      .populate('dependencies', 'milestoneName status scheduledDate');

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: milestone,
      message: 'Milestone retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving milestone',
      error: error.message
    });
  }
};

// Create new milestone
exports.createMilestone = async (req, res) => {
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
    if (!canManageMilestones(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create milestones for this project'
      });
    }

    const milestoneData = {
      ...req.body,
      projectId,
      milestoneId: req.body.milestoneId || `MS-${Date.now()}-${uuidv4().substr(0, 6)}`
    };

    const milestone = new Milestone(milestoneData);
    await milestone.save();

    await milestone.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'dependencies', select: 'milestoneName status' }
    ]);

    res.status(201).json({
      success: true,
      data: milestone,
      message: 'Milestone created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Milestone ID already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating milestone',
      error: error.message
    });
  }
};

// Update milestone
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Check permissions
    if (!canManageMilestones(req.user, milestone.projectId)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this milestone'
      });
    }

    // Handle status changes
    if (req.body.status === 'Completed' && !milestone.actualCompletionDate) {
      milestone.actualCompletionDate = new Date();
      milestone.completionPercentage = 100;
    }

    // Update milestone
    Object.assign(milestone, req.body);
    await milestone.save();

    await milestone.populate([
      { path: 'projectId', select: 'projectName projectId' },
      { path: 'verifiedBy', select: 'name email role' },
      { path: 'dependencies', select: 'milestoneName status' }
    ]);

    res.status(200).json({
      success: true,
      data: milestone,
      message: 'Milestone updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating milestone',
      error: error.message
    });
  }
};

// Delete milestone
exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Check permissions
    if (!canManageMilestones(req.user, milestone.projectId)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this milestone'
      });
    }

    // Check for dependencies
    const dependentMilestones = await Milestone.find({ 
      dependencies: milestone._id 
    });
    
    if (dependentMilestones.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete milestone that other milestones depend on',
        dependentMilestones: dependentMilestones.map(m => ({
          id: m._id,
          name: m.milestoneName
        }))
      });
    }

    await Milestone.findByIdAndDelete(req.params.milestoneId);

    res.status(200).json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting milestone',
      error: error.message
    });
  }
};

// Verify milestone completion
exports.verifyMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId)
      .populate('projectId');
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Check if user can verify milestones
    if (!canVerifyMilestones(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to verify milestones'
      });
    }

    if (milestone.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed milestones can be verified'
      });
    }

    milestone.verifiedBy = req.user._id;
    milestone.verificationDate = new Date();
    milestone.remarks = req.body.remarks || milestone.remarks;

    await milestone.save();
    await milestone.populate('verifiedBy', 'name email role');

    res.status(200).json({
      success: true,
      data: milestone,
      message: 'Milestone verified successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error verifying milestone',
      error: error.message
    });
  }
};

// Get milestone timeline
exports.getMilestoneTimeline = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const milestones = await Milestone.find({ projectId })
      .sort({ scheduledDate: 1 })
      .populate('verifiedBy', 'name role');

    const timeline = milestones.map(milestone => ({
      id: milestone._id,
      name: milestone.milestoneName,
      category: milestone.category,
      scheduledDate: milestone.scheduledDate,
      actualCompletionDate: milestone.actualCompletionDate,
      status: milestone.status,
      completionPercentage: milestone.completionPercentage,
      isOverdue: milestone.isOverdue(),
      daysUntilDeadline: milestone.getDaysUntilDeadline(),
      verifiedBy: milestone.verifiedBy
    }));

    res.status(200).json({
      success: true,
      data: {
        projectName: project.projectName,
        projectId: project.projectId,
        timeline
      },
      message: 'Milestone timeline retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving milestone timeline',
      error: error.message
    });
  }
};

// Get overdue milestones
exports.getOverdueMilestones = async (req, res) => {
  try {
    const query = {
      status: { $nin: ['Completed'] },
      scheduledDate: { $lt: new Date() }
    };

    // Apply role-based filtering
    let projectIds = [];
    if (req.user.role !== 'super_admin' && req.user.role !== 'central_admin') {
      const locationQuery = {};
      if (req.user.jurisdiction.state) {
        locationQuery['location.state'] = req.user.jurisdiction.state;
      }
      if (req.user.jurisdiction.district) {
        locationQuery['location.district'] = req.user.jurisdiction.district;
      }
      
      const projects = await Project.find(locationQuery).select('_id');
      projectIds = projects.map(p => p._id);
      query.projectId = { $in: projectIds };
    }

    const overdueMilestones = await Milestone.find(query)
      .populate('projectId', 'projectName projectId location')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: overdueMilestones,
      count: overdueMilestones.length,
      message: 'Overdue milestones retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving overdue milestones',
      error: error.message
    });
  }
};

// Helper functions
function canManageMilestones(user, project) {
  if (['super_admin', 'central_admin'].includes(user.role)) {
    return true;
  }
  
  if (['state_nodal_admin', 'state_sc_corporation_admin'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state;
  }
  
  if (['district_collector', 'district_pacc_admin', 'implementing_agency_user'].includes(user.role)) {
    return user.jurisdiction.state === project.location.state &&
           user.jurisdiction.district === project.location.district;
  }
  
  return false;
}

function canVerifyMilestones(user) {
  return ['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector', 'auditor_oversight'].includes(user.role);
}