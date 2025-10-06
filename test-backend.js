const axios = require('axios');

// Test backend connectivity
async function testBackend() {
  console.log('Testing backend server...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test registration
    console.log('\n2. Testing registration endpoint...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5001/api/auth/register', testUser);
      console.log('✅ Registration test passed:', registerResponse.data);
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.msg?.includes('already exists')) {
        console.log('✅ Registration endpoint working (user already exists)');
      } else {
        console.log('❌ Registration error:', regError.response?.data || regError.message);
      }
    }
    
    // Test login
    console.log('\n3. Testing login endpoint...');
    try {
      const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login test passed:', loginResponse.data);
    } catch (loginError) {
      console.log('❌ Login error:', loginError.response?.data || loginError.message);
    }
    
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log('Error:', error.message);
    console.log('\nPlease start the backend server with: npm run server');
  }
}

testBackend();
