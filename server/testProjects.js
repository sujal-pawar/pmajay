const mongoose = require('mongoose');
const Project = require('./models/Project');

async function checkProjects() {
  try {
    await mongoose.connect('mongodb://localhost/pm-ajay');
    console.log('Connected to MongoDB');
    
    const projects = await Project.find({});
    console.log('\n=== PROJECT STATUS REPORT ===');
    console.log('Total projects:', projects.length);
    
    projects.forEach(p => {
      console.log(`\n${p.projectName}:`);
      console.log(`  - Status: ${p.status}`);
      console.log(`  - PACC Status: ${p.approvals?.paccApprovalStatus || 'Not set'}`);
      console.log(`  - Location: ${p.location?.district}, ${p.location?.state}`);
      console.log(`  - Scheme: ${p.schemeType}`);
    });
    
    const pendingPACC = projects.filter(p => 
      p.status === 'Awaiting PACC Approval' && 
      p.approvals?.paccApprovalStatus === 'Pending'
    );
    
    console.log(`\n=== PENDING PACC APPROVALS: ${pendingPACC.length} ===`);
    pendingPACC.forEach(p => {
      console.log(`- ${p.projectName} (${p.schemeType})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProjects();