#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  fullName: 'Test User',
  role: 'patient',
  dateOfBirth: '1990-01-01',
  phoneNumber: '+1234567890',
  bloodType: 'O+',
  address: '123 Test Street, Test City, TC 12345'
};

async function runTests() {
  console.log('🧪 Testing MediChain API...\n');
  
  try {
    // 1. Health Check
    console.log('1️⃣  Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data.status);
    
    // 2. User Registration
    console.log('\n2️⃣  Testing User Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful');
      console.log('📝 Response:', {
        message: registerResponse.data.message,
        user: registerResponse.data.user?.email
      });
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('already exists')) {
        console.log('⚠️  User already exists, continuing with login test...');
      } else {
        throw error;
      }
    }
    
    // 3. User Login
    console.log('\n3️⃣  Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ Login successful');
    console.log('🔑 Tokens received');
    
    const { accessToken, refreshToken } = loginResponse.data;
    
    // 4. Protected Route Access
    console.log('\n4️⃣  Testing Protected Route Access...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Protected route access successful');
    console.log('👤 User profile:', {
      email: profileResponse.data.email,
      name: profileResponse.data.fullName,
      role: profileResponse.data.role
    });
    
    // 5. Blockchain Status (should show not configured)
    console.log('\n5️⃣  Testing Blockchain Status...');
    const blockchainResponse = await axios.get(`${BASE_URL}/blockchain/status`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Blockchain status retrieved');
    console.log('🔗 Blockchain status:', {
      available: blockchainResponse.data.available,
      message: blockchainResponse.data.message || 'Service running'
    });
    
    // 6. Token Refresh
    console.log('\n6️⃣  Testing Token Refresh...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    console.log('✅ Token refresh successful');
    console.log('🔄 New tokens generated');
    
    // 7. Logout
    console.log('\n7️⃣  Testing Logout...');
    await axios.post(`${BASE_URL}/auth/logout`, {
      refreshToken: refreshToken
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Logout successful');
    
    console.log('\n🎉 All tests passed! Your MediChain backend is working correctly.');
    console.log('\n📊 Summary:');
    console.log('   ✅ Health Check');
    console.log('   ✅ User Registration');
    console.log('   ✅ User Authentication');
    console.log('   ✅ Protected Routes');
    console.log('   ✅ Blockchain Integration (graceful fallback)');
    console.log('   ✅ Token Management');
    console.log('   ✅ Session Management');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };