const { ethers } = require('ethers');

// Generate a new random wallet
console.log('🔐 Generating new test wallet...\n');

const wallet = ethers.Wallet.createRandom();

console.log('Wallet Details:');
console.log('===============');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);
console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('- This is for TESTNET ONLY - Never use for mainnet!');
console.log('- Keep your private key secure and never share it');
console.log('- The mnemonic can recover your wallet');
console.log('\n📝 Next Steps:');
console.log('1. Copy the private key to your .env file');
console.log('2. Add the wallet address to your .env file');
console.log('3. Get test MATIC tokens from Mumbai faucet');
console.log('4. Deploy your smart contract');