const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const beneficiarySchema = new mongoose.Schema(
  {
    beneficiaryId: {
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
    personalInfo: {
      name: {
        type: String,
        required: true
      },
      aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
          validator: function(v) {
            return /^\d{12}$/.test(v);
          },
          message: 'Aadhaar number must be 12 digits'
        }
      },
      category: {
        type: String,
        required: true,
        enum: ['SC', 'ST', 'General', 'OBC']
      },
      gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
      },
      age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
      },
      contactNumber: {
        type: String,
        validate: {
          validator: function(v) {
            return /^\d{10}$/.test(v);
          },
          message: 'Contact number must be 10 digits'
        }
      },
      address: {
        type: String,
        required: true
      }
    },
    eligibilityCriteria: {
      incomeLevel: {
        type: String,
        enum: ['BPL', 'APL', 'AAY']
      },
      familySize: {
        type: Number,
        min: 1
      },
      landOwnership: {
        type: String,
        enum: ['Landless', 'Marginal', 'Small', 'Medium', 'Large']
      }
    },
    benefitsReceived: [{
      benefitType: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      dateReceived: {
        type: Date,
        required: true
      },
      status: {
        type: String,
        enum: ['Approved', 'Disbursed', 'Pending', 'Rejected'],
        default: 'Pending'
      }
    }],
    verificationStatus: {
      type: String,
      required: true,
      enum: ['Verified', 'Pending', 'Rejected'],
      default: 'Pending'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
beneficiarySchema.index({ projectId: 1, verificationStatus: 1 });
beneficiarySchema.index({ 'personalInfo.category': 1 });

// Virtual for total benefits received
beneficiarySchema.virtual('totalBenefitsAmount').get(function() {
  return this.benefitsReceived.reduce((total, benefit) => {
    return total + (benefit.status === 'Disbursed' ? benefit.amount : 0);
  }, 0);
});

// Method to check eligibility
beneficiarySchema.methods.checkEligibility = function() {
  // Add custom eligibility logic here
  return this.verificationStatus === 'Verified';
};

// Add pagination plugin
beneficiarySchema.plugin(mongoosePaginate);

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);

module.exports = Beneficiary;