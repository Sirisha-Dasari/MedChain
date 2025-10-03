const { ethers } = require('ethers');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔗 Testing blockchain connection...');
    
    // Test network connection
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId.toString());
    
    // Test wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('✅ Wallet address:', wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    console.log('💰 Wallet balance:', balanceInMatic, 'MATIC');
    
    if (parseFloat(balanceInMatic) > 0) {
      console.log('🎉 Ready to deploy! You have test MATIC tokens.');
      console.log('📋 Run: npm run blockchain:deploy:mumbai');
    } else {
      console.log('⚠️  No MATIC balance. Please get test tokens from faucet:');
      console.log('   https://faucet.polygon.technology/');
      console.log('   Wallet:', wallet.address);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();