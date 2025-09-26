const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    schemeType: {
      type: String,
      required: true,
      enum: ['Adarsh Gram', 'GIA', 'Hostel', 'Rural Development', 'Infrastructure', 'Housing', 'Sanitation', 'Water Supply', 'Education', 'Healthcare', 'Roads'],
      index: true
    },
    projectName: {
      type: String,
      required: true
    },
    projectDescription: {
      type: String,
      required: true
    },
    location: {
      state: {
        type: String,
        required: true,
        index: true
      },
      district: {
        type: String,
        required: true,
        index: true
      },
      block: String,
      village: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    financials: {
      estimatedCost: {
        type: Number,
        required: true
      },
      sanctionedAmount: {
        type: Number,
        default: 0
      },
      totalReleased: {
        type: Number,
        default: 0
      },
      totalUtilized: {
        type: Number,
        default: 0
      }
    },
    timeline: {
      startDate: {
        type: Date,
        required: true
      },
      scheduledEndDate: {
        type: Date,
        required: true
      },
      actualEndDate: Date
    },
    status: {
      type: String,
      required: true,
      enum: ['Planned', 'Awaiting PACC Approval', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
      default: 'Planned',
      index: true
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    assignedAgencies: {
      implementingAgency: String,
      contractorId: String,
      supervisingOfficer: String
    },
    approvals: {
      paccApprovalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      paccApprovalDate: Date,
      submittedForPACCOn: Date,
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      districtApprovalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      stateApprovalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      centralApprovalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      approvalDate: Date
    },
    technicalDetails: {
      complexity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
      },
      duration: {
        type: Number, // in months
        required: true
      },
      beneficiaryCount: {
        type: Number,
        required: true
      },
      projectType: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for better query performance
projectSchema.index({ 'location.state': 1, 'location.district': 1 });
projectSchema.index({ status: 1, priority: 1 });
projectSchema.index({ schemeType: 1, status: 1 });

// Virtual for calculating project progress percentage
projectSchema.virtual('progressPercentage').get(function() {
  if (this.financials.sanctionedAmount === 0) return 0;
  return Math.round((this.financials.totalUtilized / this.financials.sanctionedAmount) * 100);
});

// Method to check if project is overdue
projectSchema.methods.isOverdue = function() {
  if (this.status === 'Completed') return false;
  return new Date() > this.timeline.scheduledEndDate;
};

// Method to get days remaining
projectSchema.methods.getDaysRemaining = function() {
  if (this.status === 'Completed') return 0;
  const today = new Date();
  const endDate = this.timeline.scheduledEndDate;
  const timeDiff = endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Add pagination plugin
projectSchema.plugin(mongoosePaginate);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;