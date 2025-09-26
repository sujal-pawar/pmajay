const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Models
const User = require('./models/User');
const Project = require('./models/Project');
const Milestone = require('./models/Milestone');
const ProgressUpdate = require('./models/ProgressUpdate');
const Beneficiary = require('./models/Beneficiary');
const FundManagement = require('./models/FundManagement');

// Connect to database
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    await connectDB();
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await ProgressUpdate.deleteMany({});
    await Beneficiary.deleteMany({});
    await FundManagement.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // --- USERS (Maharashtra only) ---
    const userData = [
      {
        name: 'Super Admin',
        email: 'super.admin@pmajay.gov.in',
        password: '123123',
        role: 'super_admin',
        jurisdiction: { state: 'All', district: 'All' },
        isEmailVerified: true,
      },
      {
        name: 'Central Admin',
        email: 'central.admin@pmajay.gov.in',
        password: '123123',
        role: 'central_admin',
        jurisdiction: { state: 'All', district: 'All' },
        isEmailVerified: true,
      },
      {
        name: 'State Nodal Officer (Maharashtra)',
        email: 'state.nodal@maharashtra.gov.in',
        password: '123123',
        role: 'state_nodal_admin',
        jurisdiction: { state: 'Maharashtra', district: 'All' },
        isEmailVerified: true,
      },
      {
        name: 'District Collector (Mumbai)',
        email: 'collector@mumbai.gov.in',
        password: '123123',
        role: 'district_collector',
        jurisdiction: { state: 'Maharashtra', district: 'Mumbai' },
        isEmailVerified: true,
      },
      {
        name: 'Gram Panchayat Officer (Govandi)',
        email: 'gp@govandi.gov.in',
        password: '123123',
        role: 'gram_panchayat_user',
        jurisdiction: { state: 'Maharashtra', district: 'Mumbai', village: 'Govandi' },
        isEmailVerified: true,
      },
      {
        name: 'Implementing Agency (Maharashtra)',
        email: 'agency@mahimpl.com',
        password: '123123',
        role: 'implementing_agency_user',
        jurisdiction: { state: 'Maharashtra', district: 'Mumbai' },
        isEmailVerified: true,
      },
      {
        name: 'Construction Contractor (Maharashtra)',
        email: 'contractor@mahbuild.com',
        password: '123123',
        role: 'contractor_vendor',
        jurisdiction: { state: 'Maharashtra', district: 'Mumbai' },
        isEmailVerified: true,
      }
    ];

    const users = await User.create(userData);
    console.log('👥 Created sample users');

    // --- PROJECTS (Maharashtra only) ---
    const projectData = [
      {
        projectId: 'PMAJAY-MAH-MUM-001',
        schemeType: 'Adarsh Gram',
        projectName: 'Govandi Slum Rehabilitation',
        projectDescription: 'Upgrading slum infrastructure, housing, and sanitation facilities in Govandi, Mumbai.',
        createdBy: users.find(u => u.email === 'state.nodal@maharashtra.gov.in')._id,
        location: {
          state: 'Maharashtra',
          district: 'Mumbai',
          block: 'Kurla',
          village: 'Govandi',
          coordinates: { latitude: 19.0651, longitude: 72.8967 }
        },
        financials: {
          estimatedCost: 12000000,
          sanctionedAmount: 11500000,
          totalReleased: 6000000,
          totalUtilized: 4500000
        },
        timeline: {
          startDate: new Date('2024-02-25'),
          scheduledEndDate: new Date('2025-12-15')
        },
        status: 'In Progress',
        priority: 'High',
        assignedAgencies: {
          implementingAgency: 'Maharashtra Urban Development Agency',
          contractorId: users.find(u => u.email === 'contractor@mahbuild.com')._id.toString(),
          supervisingOfficer: users.find(u => u.email === 'collector@mumbai.gov.in')._id.toString()
        }
      },
      {
        projectId: 'PMAJAY-MAH-MUM-002',
        schemeType: 'Infrastructure',
        projectName: 'Mumbai Road Upgradation',
        projectDescription: 'Improvement of roads connecting slums and city center in Mumbai.',
        createdBy: users.find(u => u.email === 'state.nodal@maharashtra.gov.in')._id,
        location: {
          state: 'Maharashtra',
          district: 'Mumbai',
          block: 'Kurla',
          village: 'Govandi',
          coordinates: { latitude: 19.0575, longitude: 72.8994 }
        },
        financials: {
          estimatedCost: 9000000,
          sanctionedAmount: 8500000,
          totalReleased: 4250000,
          totalUtilized: 3200000
        },
        timeline: {
          startDate: new Date('2024-04-01'),
          scheduledEndDate: new Date('2025-11-01')
        },
        status: 'In Progress',
        priority: 'Medium',
        assignedAgencies: {
          implementingAgency: 'Maharashtra Urban Development Agency',
          contractorId: users.find(u => u.email === 'contractor@mahbuild.com')._id.toString(),
          supervisingOfficer: users.find(u => u.email === 'collector@mumbai.gov.in')._id.toString()
        }
      }
    ];

    const projects = await Project.create(projectData);
    console.log('🏗️  Created sample projects');

    // --- MILESTONES ---
    const milestones = [];
    for (const project of projects) {
      const milestonesArr = [
        {
          milestoneId: `${project.projectId}-M001`,
          projectId: project._id,
          milestoneName: 'Project Planning & Survey',
          description: 'Complete initial survey, planning, and documentation',
          category: 'Planning',
          scheduledDate: new Date(project.timeline.startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after start
          status: 'Completed',
          actualCompletionDate: new Date(project.timeline.startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
          completionPercentage: 100,
          verificationStatus: 'Verified',
          verifiedBy: users.find(u => u.email === 'gp@govandi.gov.in')._id
        },
        {
          milestoneId: `${project.projectId}-M002`,
          projectId: project._id,
          milestoneName: 'Foundation & Ground Work',
          description: 'Complete foundation work and ground preparation',
          category: 'Execution',
          scheduledDate: new Date(project.timeline.startDate.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days after start
          status: 'In Progress',
          completionPercentage: 75,
          verificationStatus: 'Pending'
        },
        {
          milestoneId: `${project.projectId}-M003`,
          projectId: project._id,
          milestoneName: 'Main Construction',
          description: 'Complete main construction activities',
          category: 'Execution',
          scheduledDate: new Date(project.timeline.startDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days after start
          status: 'Pending',
          completionPercentage: 25,
          verificationStatus: 'Not Required'
        },
        {
          milestoneId: `${project.projectId}-M004`,
          projectId: project._id,
          milestoneName: 'Final Inspection & Handover',
          description: 'Final quality inspection and project handover',
          category: 'Completion',
          scheduledDate: new Date(project.timeline.scheduledEndDate.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days before end
          status: 'Pending',
          completionPercentage: 0,
          verificationStatus: 'Not Required'
        }
      ];
      milestones.push(...milestonesArr);
    }
    await Milestone.create(milestones);
    console.log('🎯 Created sample milestones');

    // --- PROGRESS UPDATES ---
    const progressUpdates = [];
    for (const project of projects) {
      const updatesArr = [
        {
          updateId: `${project.projectId}-U001`,
          projectId: project._id,
          updateDate: new Date(),
          updatedBy: users.find(u => u.email === 'agency@mahimpl.com')._id,
          updateType: 'Progress',
          workCompleted: {
            description: 'Foundation work completed with concrete pouring. Site preparation and excavation finished.',
            quantitativeMetrics: {
              percentageCompleted: 40,
              unitsCompleted: 4,
              measurementUnit: 'phases'
            }
          },
          qualityParameters: {
            overallRating: 4.2,
            specificChecks: [
              {
                parameter: 'Concrete Quality',
                status: 'Pass',
                remarks: 'Quality test passed with grade M20'
              }
            ]
          },
          issues: [
            {
              issueType: 'Environmental',
              description: 'Monsoon delayed concrete work by 5 days',
              severity: 'Medium',
              resolutionStatus: 'Resolved',
              resolutionDate: new Date()
            }
          ]
        },
        {
          updateId: `${project.projectId}-U002`,
          projectId: project._id,
          updateDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          updatedBy: users.find(u => u.email === 'contractor@mahbuild.com')._id,
          updateType: 'Completion',
          workCompleted: {
            description: 'Initial survey and site preparation completed successfully.',
            quantitativeMetrics: {
              percentageCompleted: 25,
              unitsCompleted: 2,
              measurementUnit: 'phases'
            }
          },
          qualityParameters: {
            overallRating: 4.5
          }
        }
      ];
      progressUpdates.push(...updatesArr);
    }
    await ProgressUpdate.create(progressUpdates);
    console.log('📈 Created sample progress updates');

    // --- BENEFICIARIES ---
    const maharashtraBeneficiaryData = [
  {
    name: 'Sarla More',
    aadhaarNumber: '987654321012',
    category: 'SC',
    gender: 'Female',
    age: 34,
    contactNumber: '7896541230',
    address: 'Slum Area, Govandi, Mumbai, Maharashtra - 400043',
    annualIncome: 145000,
    occupation: 'Hawker',
    eligibilityStatus: 'Verified'
  },
  {
    name: 'Ravi Shinde',
    aadhaarNumber: '987654321013',
    category: 'SC',
    gender: 'Male',
    age: 37,
    contactNumber: '7896541231',
    address: 'Govandi, Mumbai, Maharashtra - 400043',
    annualIncome: 155000,
    occupation: 'Daily Wage Worker',
    eligibilityStatus: 'Pending'
  },
  {
    name: 'Aarti Pawar',
    aadhaarNumber: '987654321014',
    category: 'SC',
    gender: 'Female',
    age: 28,
    contactNumber: '7896541232',
    address: 'Shivaji Nagar, Govandi, Mumbai, Maharashtra - 400043',
    annualIncome: 130000,
    occupation: 'Tailor',
    eligibilityStatus: 'Verified'
  },
  {
    name: 'Sunil Kadam',
    aadhaarNumber: '987654321015',
    category: 'SC',
    gender: 'Male',
    age: 41,
    contactNumber: '7896541233',
    address: 'Baiganwadi, Govandi, Mumbai, Maharashtra - 400043',
    annualIncome: 160000,
    occupation: 'Driver',
    eligibilityStatus: 'Pending'
  }
];


    const beneficiaries = [];
    let mahIdx = 0;

    // Maharashtra beneficiaries (first 2 projects)
    for (const project of projects.slice(0, 2)) {
      const gramUserId = users.find(u => u.email === 'gp@govandi.gov.in')._id;
      const data1 = maharashtraBeneficiaryData[mahIdx];
      const data2 = maharashtraBeneficiaryData[mahIdx + 1];
      beneficiaries.push({
        beneficiaryId: `${project.projectId}-B001`,
        projectId: project._id,
        personalInfo: { ...data1 },
        economicInfo: {
          annualIncome: data1.annualIncome,
          occupation: data1.occupation,
          bplCardNumber: `BPL${987654321 + mahIdx}`
        },
        bankDetails: {
          accountNumber: `${98765432101234 + mahIdx}`,
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        },
        eligibilityStatus: data1.eligibilityStatus,
        verificationDate: data1.eligibilityStatus === 'Verified' ? new Date() : undefined,
        verifiedBy: data1.eligibilityStatus === 'Verified' ? gramUserId : undefined
      });
      beneficiaries.push({
        beneficiaryId: `${project.projectId}-B002`,
        projectId: project._id,
        personalInfo: { ...data2 },
        economicInfo: {
          annualIncome: data2.annualIncome,
          occupation: data2.occupation,
          bplCardNumber: `BPL${987654321 + mahIdx + 1}`
        },
        bankDetails: {
          accountNumber: `${98765432101234 + mahIdx + 1}`,
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India'
        },
        eligibilityStatus: data2.eligibilityStatus,
        verificationDate: data2.eligibilityStatus === 'Verified' ? new Date() : undefined,
        verifiedBy: data2.eligibilityStatus === 'Verified' ? gramUserId : undefined
      });
      mahIdx += 2;
    }

    await Beneficiary.create(beneficiaries);
    console.log('👥 Created sample beneficiaries');

    // --- FUND MANAGEMENT ---
    const fundRecords = [];
    for (const project of projects) {
      const stateCorp = 'Maharashtra State SC Corporation';
      const nodalEmail = 'state.nodal@maharashtra.gov.in';
      const collectorEmail = 'collector@mumbai.gov.in';

      const recordsArr = [
        {
          transactionId: `${project.projectId}-F001`,
          projectId: project._id,
          transactionType: 'Release',
          amount: project.financials.totalReleased / 2,
          transactionDate: new Date(project.timeline.startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          sourceAgency: 'Ministry of Social Justice & Empowerment',
          destinationAgency: stateCorp,
          approvedBy: users.find(u => u.email === nodalEmail)._id,
          purpose: 'First installment release for project implementation',
          utilizationDetails: {
            category: 'Material',
            description: 'Funds for construction materials and initial setup'
          },
          documents: [
            {
              type: 'Sanction Letter',
              documentNumber: 'SL-001-2024'
            }
          ]
        },
        {
          transactionId: `${project.projectId}-F002`,
          projectId: project._id,
          transactionType: 'Utilization',
          amount: project.financials.totalUtilized,
          transactionDate: new Date(),
          sourceAgency: stateCorp,
          destinationAgency: 'District Collector Office',
          approvedBy: users.find(u => u.email === collectorEmail)._id,
          purpose: 'Funds utilized for construction materials and labor',
          utilizationDetails: {
            category: 'Labor',
            description: 'Purchase of cement, steel, and other construction materials'
          }
        }
      ];
      fundRecords.push(...recordsArr);
    }
    await FundManagement.create(fundRecords);
    console.log('💰 Created sample fund records');

    // --- SUMMARY OUTPUT ---
    console.log('✅ Data seeding completed successfully!');
    console.log(`
📊 Summary:
- Users: ${users.length}
- Projects: ${projects.length}
- Milestones: ${milestones.length}
- Progress Updates: ${progressUpdates.length}
- Beneficiaries: ${beneficiaries.length}
- Fund Records: ${fundRecords.length}

🔐 Login Credentials (all passwords: 123123):
- Super Admin: super.admin@pmajay.gov.in
- Central Admin: central.admin@pmajay.gov.in
- State Nodal (Maharashtra): state.nodal@maharashtra.gov.in
- District Collector (Mumbai): collector@mumbai.gov.in
- Gram Panchayat (Govandi): gp@govandi.gov.in
- Implementing Agency (Maharashtra): agency@mahimpl.com
- Contractor (Maharashtra): contractor@mahbuild.com
    `);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
