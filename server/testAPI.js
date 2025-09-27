const axios = require('axios');
const baseURL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Login as GP user
    const loginResponse = await axios.post(baseURL + '/auth/login', {
      email: 'gp@govandi.gov.in',
      password: '123123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('📄 Login response:', JSON.stringify(loginResponse.data, null, 2));
    
    // Get user's projects
    const projectsResponse = await axios.get(baseURL + '/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const projects = projectsResponse.data.data.docs || [];
    console.log('✅ Projects found:', projects.length);
    
    if (projects.length > 0) {
      console.log('📋 Available Projects:');
      projects.forEach((p, i) => {
        console.log(`  ${i+1}. ${p.projectName} - ${p.status}`);
      });
      
      // Try to initiate conversation with first project
      const firstProject = projects[0];
      try {
        const conversationResponse = await axios.post(baseURL + '/messages/initiate-conversation', {
          projectId: firstProject._id,
          content: 'Hello, I would like to discuss this project with you.'
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Conversation initiated successfully');
        console.log('💬 Conversation ID:', conversationResponse.data.data.conversationId);
        
        // Check conversations
        const conversationsResponse = await axios.get(baseURL + '/messages/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ Total conversations:', conversationsResponse.data.data.length);
        
      } catch (convError) {
        console.log('❌ Conversation error:', convError.response?.data?.message || convError.message);
        if (convError.response?.data) {
          console.log('📄 Error details:', JSON.stringify(convError.response.data, null, 2));
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
  }
}

testAPI();