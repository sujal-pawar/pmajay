const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const progressUpdateSchema = new mongoose.Schema(
  {
    updateId: {
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
    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    },
    updateDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updateType: {
      type: String,
      required: true,
      enum: ['Progress', 'Issue', 'Completion', 'Delay', 'Quality Check']
    },
    workCompleted: {
      description: {
        type: String,
        required: true
      },
      quantitativeMetrics: {
        percentageCompleted: {
          type: Number,
          min: 0,
          max: 100
        },
        unitsCompleted: Number,
        measurementUnit: String
      }
    },
    evidence: {
      beforePhotos: [String],
      afterPhotos: [String],
      documents: [String]
    },
    issues: [{
      issueType: {
        type: String,
        required: true,
        enum: ['Technical', 'Financial', 'Administrative', 'Environmental', 'Social']
      },
      description: {
        type: String,
        required: true
      },
      severity: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Critical']
      },
      resolutionStatus: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
      },
      resolutionDate: Date,
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    nextSteps: String,
    resourcesUsed: {
      materials: [{
        name: String,
        quantity: Number,
        unit: String,
        cost: Number
      }],
      manpower: {
        skilled: Number,
        unskilled: Number,
        supervisory: Number
      },
      equipment: [{
        name: String,
        hours: Number,
        cost: Number
      }]
    },
    qualityParameters: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      remarks: String,
      checkedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for better query performance
progressUpdateSchema.index({ projectId: 1, updateDate: -1 });
progressUpdateSchema.index({ milestoneId: 1, updateDate: -1 });
progressUpdateSchema.index({ updateType: 1, updateDate: -1 });

// Method to calculate cost efficiency
progressUpdateSchema.methods.calculateCostEfficiency = function() {
  const totalResourceCost = this.resourcesUsed.materials.reduce((sum, material) => sum + (material.cost || 0), 0) +
                           this.resourcesUsed.equipment.reduce((sum, equipment) => sum + (equipment.cost || 0), 0);
  
  return {
    totalCost: totalResourceCost,
    costPerPercentage: this.workCompleted.quantitativeMetrics.percentageCompleted > 0 
      ? totalResourceCost / this.workCompleted.quantitativeMetrics.percentageCompleted 
      : 0
  };
};

// Add pagination plugin
progressUpdateSchema.plugin(mongoosePaginate);

const ProgressUpdate = mongoose.model('ProgressUpdate', progressUpdateSchema);

module.exports = ProgressUpdate;