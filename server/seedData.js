// Load environment variables first
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
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await ProgressUpdate.deleteMany({});
    await Beneficiary.deleteMany({});
    await FundManagement.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create sample users for each role
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'super.admin@pmajay.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'super_admin',
        jurisdiction: { state: 'All', district: 'All' }
      },
      {
        name: 'Central Admin',
        email: 'central.admin@pmajay.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'central_admin',
        jurisdiction: { state: 'All', district: 'All' }
      },
      {
        name: 'State Nodal Officer',
        email: 'state.nodal@gujarat.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'state_nodal_admin',
        jurisdiction: { state: 'Gujarat', district: 'All' }
      },
      {
        name: 'District Collector',
        email: 'collector@ahmedabad.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'district_collector',
        jurisdiction: { state: 'Gujarat', district: 'Ahmedabad' }
      },
      {
        name: 'PACC Admin',
        email: 'pacc@ahmedabad.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'district_pacc_admin',
        jurisdiction: { state: 'Gujarat', district: 'Ahmedabad' }
      },
      {
        name: 'Gram Panchayat Officer',
        email: 'gp@sarkhej.gov.in',
        password: await bcrypt.hash('123123', 10),
        role: 'gram_panchayat_user',
        jurisdiction: { state: 'Gujarat', district: 'Ahmedabad', village: 'Sarkhej' }
      },
      {
        name: 'Implementing Agency',
        email: 'agency@impl.com',
        password: await bcrypt.hash('123123', 10),
        role: 'implementing_agency_user',
        jurisdiction: { state: 'Gujarat', district: 'Ahmedabad' }
      },
      {
        name: 'Construction Contractor',
        email: 'contractor@build.com',
        password: await bcrypt.hash('123123', 10),
        role: 'contractor_vendor',
        jurisdiction: { state: 'Gujarat', district: 'Ahmedabad' }
      }
    ]);
    
    console.log('👥 Created sample users');
    
    // Create sample projects
    const projects = await Project.create([
      {
        projectId: 'PMAJAY-GUJ-AHM-001',
        schemeType: 'Adarsh Gram',
        projectName: 'Sarkhej Village Development',
        projectDescription: 'Comprehensive development of Sarkhej village including infrastructure, education, and healthcare facilities.',
        createdBy: users.find(u => u.role === 'state_nodal_admin')._id,
        location: {
          state: 'Gujarat',
          district: 'Ahmedabad',
          block: 'Sanand',
          village: 'Sarkhej',
          coordinates: { latitude: 23.0225, longitude: 72.5714 }
        },
        financials: {
          estimatedCost: 5000000,
          sanctionedAmount: 4500000,
          totalReleased: 2250000,
          totalUtilized: 1800000
        },
        timeline: {
          startDate: new Date('2024-01-15'),
          scheduledEndDate: new Date('2025-12-31')
        },
        status: 'In Progress',
        priority: 'High',
        assignedAgencies: {
          implementingAgency: 'Gujarat Rural Development Agency',
          contractorId: users.find(u => u.role === 'contractor_vendor')._id.toString(),
          supervisingOfficer: users.find(u => u.role === 'district_collector')._id.toString()
        }
      },
      {
        projectId: 'PMAJAY-GUJ-AHM-002',
        schemeType: 'Hostel',
        projectName: 'SC Girls Hostel Construction',
        projectDescription: 'Construction of modern hostel facility for SC girl students with 100 bed capacity.',
        createdBy: users.find(u => u.role === 'state_nodal_admin')._id,
        location: {
          state: 'Gujarat',
          district: 'Ahmedabad',
          block: 'City',
          village: 'Maninagar',
          coordinates: { latitude: 23.0225, longitude: 72.5714 }
        },
        financials: {
          estimatedCost: 8000000,
          sanctionedAmount: 7500000,
          totalReleased: 3750000,
          totalUtilized: 2500000
        },
        timeline: {
          startDate: new Date('2024-03-01'),
          scheduledEndDate: new Date('2025-08-31')
        },
        status: 'In Progress',
        priority: 'High',
        assignedAgencies: {
          implementingAgency: 'Gujarat Education Department',
          contractorId: users.find(u => u.role === 'contractor_vendor')._id.toString(),
          supervisingOfficer: users.find(u => u.role === 'district_collector')._id.toString()
        }
      },
      {
        projectId: 'PMAJAY-GUJ-AHM-003',
        schemeType: 'Infrastructure',
        projectName: 'Rural Road Connectivity',
        projectDescription: 'Construction of all-weather roads connecting remote villages to main highway.',
        createdBy: users.find(u => u.role === 'state_nodal_admin')._id,
        location: {
          state: 'Gujarat',
          district: 'Ahmedabad',
          block: 'Dholka',
          village: 'Multiple Villages'
        },
        financials: {
          estimatedCost: 12000000,
          sanctionedAmount: 11000000,
          totalReleased: 5500000,
          totalUtilized: 4200000
        },
        timeline: {
          startDate: new Date('2024-02-01'),
          scheduledEndDate: new Date('2025-10-31')
        },
        status: 'In Progress',
        priority: 'Medium'
      }
    ]);
    
    console.log('🏗️  Created sample projects');
    
    // Create milestones for each project
    const milestones = [];
    for (const project of projects) {
      const projectMilestones = [
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
          verifiedBy: users.find(u => u.role === 'gram_panchayat_user')._id
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
      milestones.push(...projectMilestones);
    }
    
    await Milestone.create(milestones);
    console.log('🎯 Created sample milestones');
    
    // Create progress updates
    const progressUpdates = [];
    for (const project of projects) {
      const updates = [
        {
          updateId: `${project.projectId}-U001`,
          projectId: project._id,
          updateDate: new Date(),
          updatedBy: users.find(u => u.role === 'implementing_agency_user')._id,
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
          updatedBy: users.find(u => u.role === 'contractor_vendor')._id,
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
      progressUpdates.push(...updates);
    }
    
    await ProgressUpdate.create(progressUpdates);
    console.log('📈 Created sample progress updates');
    
    // Create beneficiaries
    const beneficiaryData = [
      {
        name: 'Priya Patel',
        aadhaarNumber: '123456789012',
        category: 'SC',
        gender: 'Female',
        age: 29,
        contactNumber: '9876543210',
        address: 'Main Road, Sarkhej, Ahmedabad, Gujarat - 380055',
        annualIncome: 180000,
        occupation: 'Student',
        eligibilityStatus: 'Verified'
      },
      {
        name: 'Rajesh Kumar',
        aadhaarNumber: '123456789014',
        category: 'SC',
        gender: 'Male',
        age: 32,
        contactNumber: '9876543211',
        address: 'Village Road, Sarkhej, Ahmedabad, Gujarat - 380055',
        annualIncome: 220000,
        occupation: 'Laborer',
        eligibilityStatus: 'Pending'
      },
      {
        name: 'Sunita Sharma',
        aadhaarNumber: '123456789015',
        category: 'SC',
        gender: 'Female',
        age: 25,
        contactNumber: '9876543212',
        address: 'New Colony, Maninagar, Ahmedabad, Gujarat - 380028',
        annualIncome: 150000,
        occupation: 'Housewife',
        eligibilityStatus: 'Verified'
      },
      {
        name: 'Mukesh Patel',
        aadhaarNumber: '123456789016',
        category: 'SC',
        gender: 'Male',
        age: 35,
        contactNumber: '9876543213',
        address: 'Station Road, Dholka, Ahmedabad, Gujarat - 380060',
        annualIncome: 280000,
        occupation: 'Daily Wage Worker',
        eligibilityStatus: 'Pending'
      }
    ];

    const beneficiaries = [];
    let beneficiaryIndex = 0;
    
    for (const project of projects.slice(0, 2)) { // Only for first 2 projects
      const projectBeneficiaries = [
        {
          beneficiaryId: `${project.projectId}-B001`,
          projectId: project._id,
          personalInfo: {
            name: beneficiaryData[beneficiaryIndex].name,
            aadhaarNumber: beneficiaryData[beneficiaryIndex].aadhaarNumber,
            category: beneficiaryData[beneficiaryIndex].category,
            gender: beneficiaryData[beneficiaryIndex].gender,
            age: beneficiaryData[beneficiaryIndex].age,
            contactNumber: beneficiaryData[beneficiaryIndex].contactNumber,
            address: beneficiaryData[beneficiaryIndex].address
          },
          economicInfo: {
            annualIncome: beneficiaryData[beneficiaryIndex].annualIncome,
            occupation: beneficiaryData[beneficiaryIndex].occupation,
            bplCardNumber: `BPL${123456789 + beneficiaryIndex}`
          },
          bankDetails: {
            accountNumber: `${12345678901234 + beneficiaryIndex}`,
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India'
          },
          eligibilityStatus: beneficiaryData[beneficiaryIndex].eligibilityStatus,
          verificationDate: beneficiaryData[beneficiaryIndex].eligibilityStatus === 'Verified' ? new Date() : undefined,
          verifiedBy: beneficiaryData[beneficiaryIndex].eligibilityStatus === 'Verified' ? users.find(u => u.role === 'gram_panchayat_user')._id : undefined
        },
        {
          beneficiaryId: `${project.projectId}-B002`,
          projectId: project._id,
          personalInfo: {
            name: beneficiaryData[beneficiaryIndex + 1].name,
            aadhaarNumber: beneficiaryData[beneficiaryIndex + 1].aadhaarNumber,
            category: beneficiaryData[beneficiaryIndex + 1].category,
            gender: beneficiaryData[beneficiaryIndex + 1].gender,
            age: beneficiaryData[beneficiaryIndex + 1].age,
            contactNumber: beneficiaryData[beneficiaryIndex + 1].contactNumber,
            address: beneficiaryData[beneficiaryIndex + 1].address
          },
          economicInfo: {
            annualIncome: beneficiaryData[beneficiaryIndex + 1].annualIncome,
            occupation: beneficiaryData[beneficiaryIndex + 1].occupation,
            bplCardNumber: `BPL${123456789 + beneficiaryIndex + 1}`
          },
          eligibilityStatus: beneficiaryData[beneficiaryIndex + 1].eligibilityStatus,
          verificationDate: beneficiaryData[beneficiaryIndex + 1].eligibilityStatus === 'Verified' ? new Date() : undefined,
          verifiedBy: beneficiaryData[beneficiaryIndex + 1].eligibilityStatus === 'Verified' ? users.find(u => u.role === 'gram_panchayat_user')._id : undefined
        }
      ];
      beneficiaries.push(...projectBeneficiaries);
      beneficiaryIndex += 2;
    }
    
    await Beneficiary.create(beneficiaries);
    console.log('👥 Created sample beneficiaries');
    
    // Create fund management records
    const fundRecords = [];
    for (const project of projects) {
      const records = [
        {
          transactionId: `${project.projectId}-F001`,
          projectId: project._id,
          transactionType: 'Release',
          amount: project.financials.totalReleased / 2,
          transactionDate: new Date(project.timeline.startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          sourceAgency: 'Ministry of Social Justice & Empowerment',
          destinationAgency: 'Gujarat State SC Corporation',
          approvedBy: users.find(u => u.role === 'state_nodal_admin')._id,
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
          sourceAgency: 'Gujarat State SC Corporation',
          destinationAgency: 'District Collector Office',
          approvedBy: users.find(u => u.role === 'district_collector')._id,
          purpose: 'Funds utilized for construction materials and labor',
          utilizationDetails: {
            category: 'Labor',
            description: 'Purchase of cement, steel, and other construction materials'
          }
        }
      ];
      fundRecords.push(...records);
    }
    
    await FundManagement.create(fundRecords);
    console.log('💰 Created sample fund records');
    
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
- State Nodal: state.nodal@gujarat.gov.in
- District Collector: collector@ahmedabad.gov.in
- PACC Admin: pacc@ahmedabad.gov.in
- Gram Panchayat: gp@sarkhej.gov.in
- Implementing Agency: agency@impl.com
- Contractor: contractor@build.com
    `);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seeder
seedData();