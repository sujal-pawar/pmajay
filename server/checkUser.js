const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect('mongodb://localhost/pm-ajay');
    console.log('Connected to MongoDB');
    
    const paccAdmin = await User.findOne({ email: 'pacc@mumbai.gov.in' });
    
    if (paccAdmin) {
      console.log('\n=== PACC ADMIN DETAILS ===');
      console.log('Name:', paccAdmin.name);
      console.log('Email:', paccAdmin.email);
      console.log('Role:', paccAdmin.role);
      console.log('Jurisdiction:', JSON.stringify(paccAdmin.jurisdiction, null, 2));
      console.log('Email Verified:', paccAdmin.isEmailVerified);
    } else {
      console.log('PACC Admin not found!');
    }
    
    // Check all users with district_pacc_admin role
    const allPaccAdmins = await User.find({ role: 'district_pacc_admin' });
    console.log('\n=== ALL PACC ADMINS ===');
    allPaccAdmins.forEach(admin => {
      console.log(`- ${admin.name} (${admin.email}) - ${admin.role}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();