const mongoose = require('mongoose');
require('dotenv').config();

async function createIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for indexing...');

    const db = mongoose.connection.db;

    // Projects Collection Indexes
    console.log('Creating indexes for Projects collection...');
    await db.collection('projects').createIndex({ projectId: 1 }, { unique: true });
    await db.collection('projects').createIndex({ 'location.state': 1, 'location.district': 1 });
    await db.collection('projects').createIndex({ status: 1 });
    await db.collection('projects').createIndex({ schemeType: 1 });
    await db.collection('projects').createIndex({ status: 1, priority: 1 });
    await db.collection('projects').createIndex({ schemeType: 1, status: 1 });
    await db.collection('projects').createIndex({ createdAt: -1 });

    // Milestones Collection Indexes
    console.log('Creating indexes for Milestones collection...');
    await db.collection('milestones').createIndex({ milestoneId: 1 }, { unique: true });
    await db.collection('milestones').createIndex({ projectId: 1 });
    await db.collection('milestones').createIndex({ status: 1 });
    await db.collection('milestones').createIndex({ scheduledDate: 1 });
    await db.collection('milestones').createIndex({ projectId: 1, scheduledDate: 1 });
    await db.collection('milestones').createIndex({ status: 1, scheduledDate: 1 });

    // Beneficiaries Collection Indexes
    console.log('Creating indexes for Beneficiaries collection...');
    await db.collection('beneficiaries').createIndex({ beneficiaryId: 1 }, { unique: true });
    await db.collection('beneficiaries').createIndex({ 'personalInfo.aadhaarNumber': 1 }, { unique: true });
    await db.collection('beneficiaries').createIndex({ projectId: 1 });
    await db.collection('beneficiaries').createIndex({ projectId: 1, verificationStatus: 1 });
    await db.collection('beneficiaries').createIndex({ 'personalInfo.category': 1 });
    await db.collection('beneficiaries').createIndex({ registrationDate: -1 });

    // Progress Updates Collection Indexes
    console.log('Creating indexes for Progress Updates collection...');
    await db.collection('progressupdates').createIndex({ updateId: 1 }, { unique: true });
    await db.collection('progressupdates').createIndex({ projectId: 1, updateDate: -1 });
    await db.collection('progressupdates').createIndex({ milestoneId: 1, updateDate: -1 });
    await db.collection('progressupdates').createIndex({ updateType: 1, updateDate: -1 });
    await db.collection('progressupdates').createIndex({ updatedBy: 1 });

    // Fund Management Collection Indexes
    console.log('Creating indexes for Fund Management collection...');
    await db.collection('fundmanagements').createIndex({ transactionId: 1 }, { unique: true });
    await db.collection('fundmanagements').createIndex({ projectId: 1 });
    await db.collection('fundmanagements').createIndex({ projectId: 1, transactionDate: -1 });
    await db.collection('fundmanagements').createIndex({ transactionDate: -1 });
    await db.collection('fundmanagements').createIndex({ transactionType: 1, status: 1 });
    await db.collection('fundmanagements').createIndex({ sourceAgency: 1, destinationAgency: 1 });
    await db.collection('fundmanagements').createIndex({ status: 1 });
    await db.collection('fundmanagements').createIndex({ 'approvalWorkflow.level': 1, 'approvalWorkflow.status': 1 });

    // Communications Collection Indexes
    console.log('Creating indexes for Communications collection...');
    await db.collection('communications').createIndex({ messageId: 1 }, { unique: true });
    await db.collection('communications').createIndex({ fromUser: 1, timestamp: -1 });
    await db.collection('communications').createIndex({ toUser: 1, readStatus: 1, timestamp: -1 });
    await db.collection('communications').createIndex({ projectId: 1, timestamp: -1 });
    await db.collection('communications').createIndex({ messageType: 1, priority: 1 });
    await db.collection('communications').createIndex({ status: 1 });

    // Users Collection Indexes (if not already created)
    console.log('Creating indexes for Users collection...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ 'jurisdiction.state': 1, 'jurisdiction.district': 1 });

    // Compound indexes for common queries
    console.log('Creating compound indexes...');
    
    // Project location and status queries
    await db.collection('projects').createIndex({ 
      'location.state': 1, 
      'location.district': 1, 
      status: 1 
    });

    // Milestone project and status queries
    await db.collection('milestones').createIndex({ 
      projectId: 1, 
      status: 1, 
      scheduledDate: 1 
    });

    // Progress updates with project and type
    await db.collection('progressupdates').createIndex({ 
      projectId: 1, 
      updateType: 1, 
      updateDate: -1 
    });

    // Fund transactions with project and status
    await db.collection('fundmanagements').createIndex({ 
      projectId: 1, 
      status: 1, 
      transactionDate: -1 
    });

    // User role and jurisdiction
    await db.collection('users').createIndex({ 
      role: 1, 
      'jurisdiction.state': 1 
    });

    console.log('✅ All indexes created successfully!');
    
    // Display created indexes
    const collections = ['projects', 'milestones', 'beneficiaries', 'progressupdates', 'fundmanagements', 'communications', 'users'];
    
    for (const collectionName of collections) {
      const indexes = await db.collection(collectionName).indexes();
      console.log(`\n${collectionName.toUpperCase()} Collection Indexes:`);
      indexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${JSON.stringify(index.key)} ${index.unique ? '(unique)' : ''}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

// Run the indexing
createIndexes();