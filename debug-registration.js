const axios = require('axios');

async function testRegistration() {
  const testUser = {
    email: 'debug@test.com',
    password: 'TestPassword123!',
    fullName: 'Debug User',
    role: 'patient',
    dateOfBirth: '1990-01-01',
    phoneNumber: '+1234567890',
    bloodType: 'O+',
    address: '123 Debug Street'
  };

  try {
    console.log('🔍 Testing registration with user data:', JSON.stringify(testUser, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Registration successful:', response.data);
    
  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('Request Headers:', JSON.stringify(error.config?.headers, null, 2));
  }
}

testRegistration();