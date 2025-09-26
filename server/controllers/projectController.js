const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const ProgressUpdate = require('../models/ProgressUpdate');
const { v4: uuidv4 } = require('uuid');

// Get all projects with filtering and pagination
exports.getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      schemeType,
      state,
      district,
      priority,
      search
    } = req.query;

    // Build query object
    const query = {};
    
    if (status) query.status = status;
    if (schemeType) query.schemeType = schemeType;
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { projectDescription: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply role-based filtering
    if (req.user.role !== 'super_admin' && req.user.role !== 'central_admin') {
      if (req.user.jurisdiction.state) {
        query['location.state'] = req.user.jurisdiction.state;
      }
      if (req.user.jurisdiction.district) {
        query['location.district'] = req.user.jurisdiction.district;
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'createdBy', select: 'name email role' }
      ]
    };

    const projects = await Project.paginate(query, options);

    res.status(200).json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving projects',
      error: error.message
    });
  }
};

// Get single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('createdBy', 'name email role');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    if (!hasProjectAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project',
      error: error.message
    });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      projectId: req.body.projectId || `PMAJAY-${Date.now()}-${uuidv4().substr(0, 8)}`,
      createdBy: req.user._id
    };

    // Validate user permissions for project creation
    if (!canCreateProject(req.user, projectData)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to create project in this location'
      });
    }

    const project = new Project(projectData);
    await project.save();

    await project.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Project ID already exists'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canUpdateProject(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update this project'
      });
    }

    // Update project
    Object.assign(project, req.body);
    await project.save();

    await project.populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check permissions
    if (!canDeleteProject(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to delete this project'
      });
    }

    // Check if project has dependencies
    const milestoneCount = await Milestone.countDocuments({ projectId: project._id });
    const progressCount = await ProgressUpdate.countDocuments({ projectId: project._id });
    
    if (milestoneCount > 0 || progressCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing milestones or progress updates'
      });
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
};

// Get project dashboard data
exports.getProjectDashboard = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check access
    if (!hasProjectAccess(req.user, project)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this project'
      });
    }

    // Get aggregated data
    const [milestones, recentUpdates, fundSummary] = await Promise.all([
      Milestone.find({ projectId }).sort({ scheduledDate: 1 }),
      ProgressUpdate.find({ projectId }).sort({ updateDate: -1 }).limit(5)
        .populate('updatedBy', 'name'),
      // Add fund summary aggregation here
    ]);

    const dashboardData = {
      project,
      milestones: {
        total: milestones.length,
        completed: milestones.filter(m => m.status === 'Completed').length,
        pending: milestones.filter(m => m.status === 'Pending').length,
        overdue: milestones.filter(m => m.isOverdue()).length
      },
      recentUpdates,
      timeline: {
        startDate: project.timeline.startDate,
        endDate: project.timeline.scheduledEndDate,
        daysRemaining: project.getDaysRemaining(),
        isOverdue: project.isOverdue()
      },
      financial: {
        estimatedCost: project.financials.estimatedCost,
        sanctionedAmount: project.financials.sanctionedAmount,
        utilized: project.financials.totalUtilized,
        utilizationPercentage: project.progressPercentage
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
      message: 'Project dashboard data retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving project dashboard',
      error: error.message
    });
  }
};

// Helper functions for permission checking
function hasProjectAccess(user, project) {
  if (user.role === 'super_admin' || user.role === 'central_admin') {
    return true;
  }
  
  if (user.jurisdiction.state && project.location.state !== user.jurisdiction.state) {
    return false;
  }
  
  if (user.jurisdiction.district && project.location.district !== user.jurisdiction.district) {
    return false;
  }
  
  return true;
}

function canCreateProject(user, projectData) {
  if (user.role === 'super_admin' || user.role === 'central_admin') {
    return true;
  }
  
  if (user.role === 'state_nodal_admin' || user.role === 'state_sc_corporation_admin') {
    return user.jurisdiction.state === projectData.location.state;
  }
  
  if (user.role === 'district_collector' || user.role === 'district_pacc_admin') {
    return user.jurisdiction.state === projectData.location.state &&
           user.jurisdiction.district === projectData.location.district;
  }
  
  return false;
}

function canUpdateProject(user, project) {
  return hasProjectAccess(user, project) && 
         ['super_admin', 'central_admin', 'state_nodal_admin', 'district_collector'].includes(user.role);
}

function canDeleteProject(user, project) {
  return hasProjectAccess(user, project) && 
         ['super_admin', 'central_admin'].includes(user.role);
}