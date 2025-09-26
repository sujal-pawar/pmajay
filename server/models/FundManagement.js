const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const fundManagementSchema = new mongoose.Schema(
  {
    transactionId: {
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
    transactionType: {
      type: String,
      required: true,
      enum: ['Release', 'Utilization', 'Refund', 'Transfer']
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transactionDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    sourceAgency: {
      type: String,
      required: true
    },
    destinationAgency: {
      type: String,
      required: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    utilizationDetails: {
      category: {
        type: String,
        enum: ['Material', 'Labor', 'Equipment', 'Administrative', 'Contingency'],
        required: true
      },
      description: String,
      invoiceNumber: String,
      vendorDetails: {
        name: String,
        contactInfo: String,
        gstNumber: String
      },
      items: [{
        description: String,
        quantity: Number,
        rate: Number,
        amount: Number
      }]
    },
    status: {
      type: String,
      required: true,
      enum: ['Approved', 'Pending', 'Rejected', 'In Transit', 'Completed'],
      default: 'Pending'
    },
    approvalWorkflow: [{
      level: {
        type: String,
        enum: ['District', 'State', 'Central']
      },
      approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected']
      },
      comments: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    remarks: String,
    auditTrail: [{
      action: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      details: String
    }]
  },
  {
    timestamps: true
  }
);

// Compound indexes
fundManagementSchema.index({ projectId: 1, transactionDate: -1 });
fundManagementSchema.index({ transactionType: 1, status: 1 });
fundManagementSchema.index({ sourceAgency: 1, destinationAgency: 1 });

// Virtual for calculating utilization percentage
fundManagementSchema.virtual('utilizationPercentage').get(function() {
  // This would be calculated based on project's total sanctioned amount
  // Implementation depends on the specific business logic
  return 0;
});

// Method to add audit trail entry
fundManagementSchema.methods.addAuditEntry = function(action, performedBy, details) {
  this.auditTrail.push({
    action,
    performedBy,
    details,
    timestamp: new Date()
  });
};

// Method to check if approval is required
fundManagementSchema.methods.requiresApproval = function() {
  const highValueThreshold = 100000; // ₹1 Lakh
  return this.amount >= highValueThreshold;
};

// Add pagination plugin
fundManagementSchema.plugin(mongoosePaginate);

const FundManagement = mongoose.model('FundManagement', fundManagementSchema);

module.exports = FundManagement;