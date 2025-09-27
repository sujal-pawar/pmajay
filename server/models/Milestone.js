const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    milestoneId: {
      type: String,
      required: true,
      unique: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    milestoneName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Planning', 'Execution', 'Completion']
    },
    scheduledDate: {
      type: Date,
      required: true,
      index: true
    },
    actualCompletionDate: Date,
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'],
      default: 'Pending',
      index: true
    },
    dependencies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    }],
    evidence: {
      documents: [String],
      photos: [String],
      reports: [String]
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    remarks: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date
  },
  {
    timestamps: true
  }
);

// Compound indexes
milestoneSchema.index({ projectId: 1, scheduledDate: 1 });
milestoneSchema.index({ status: 1, scheduledDate: 1 });

// Method to check if milestone is overdue
milestoneSchema.methods.isOverdue = function() {
  if (this.status === 'Completed') return false;
  return new Date() > this.scheduledDate;
};

// Method to get days until deadline
milestoneSchema.methods.getDaysUntilDeadline = function() {
  if (this.status === 'Completed') return 0;
  const today = new Date();
  const deadline = this.scheduledDate;
  const timeDiff = deadline.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;