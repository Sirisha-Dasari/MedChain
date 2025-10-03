const { ethers } = require('ethers');

async function getTestTokens() {
  const walletAddress = '0xF209Fb2c83D6EBF8904f9996Ef1770125AecB54B';
  
  console.log('🪙 Getting test MATIC tokens for wallet...');
  console.log('Wallet Address:', walletAddress);
  console.log('\n🌐 Mumbai Testnet Faucets:');
  console.log('1. Official Polygon Faucet: https://faucet.polygon.technology/');
  console.log('2. Alchemy Faucet: https://mumbaifaucet.com/');
  console.log('3. QuickNode Faucet: https://faucet.quicknode.com/polygon/mumbai');
  
  console.log('\n📋 Steps to get test tokens:');
  console.log('1. Visit one of the faucet URLs above');
  console.log('2. Paste your wallet address:', walletAddress);
  console.log('3. Complete any verification (captcha/social login)');
  console.log('4. Request test MATIC tokens');
  console.log('5. Wait 1-2 minutes for tokens to arrive');
  
  console.log('\n✅ After getting tokens, run: npm run deploy:mumbai');
}

getTestTokens();