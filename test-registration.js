const axios = require('axios');

async function testRegistration() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing Registration System...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data);
    
    // Test 2: Test registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${baseURL}/api/auth/register`, testUser);
      console.log('✅ Registration successful:', {
        token: registerResponse.data.token ? 'Present' : 'Missing',
        user: registerResponse.data.user
      });
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.msg === 'User already exists') {
        console.log('⚠️  User already exists (this is expected if you ran this test before)');
      } else {
        console.log('❌ Registration failed:', registerError.response?.data || registerError.message);
      }
    }
    
    // Test 3: Test login
    console.log('\n3. Testing user login...');
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ Login successful:', {
        token: loginResponse.data.token ? 'Present' : 'Missing',
        user: loginResponse.data.user
      });
    } catch (loginError) {
      console.log('❌ Login failed:', loginError.response?.data || loginError.message);
    }
    
    console.log('\n🎉 Registration system test completed!');
    
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('1. Start MongoDB: npm run start-mongodb');
    console.log('2. Start the server: npm run server');
    console.log('3. Check if the server is running on port 5000');
  }
}

testRegistration();

