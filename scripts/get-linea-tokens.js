#!/usr/bin/env node

/**
 * Linea Testnet Faucet Helper Script
 * 
 * This script helps you get test ETH from the Linea testnet faucet
 */

require('dotenv').config();

const LINEA_TESTNET_CONFIG = {
  chainId: 59140,
  name: 'Linea Goerli Testnet',
  rpcUrl: 'https://rpc.goerli.linea.build',
  faucetUrl: 'https://faucet.goerli.linea.build',
  explorerUrl: 'https://goerli.lineascan.build',
  currency: 'ETH',
  bridgeUrl: 'https://goerli.bridge.linea.build'
};

async function main() {
  console.log('🔗 Linea Testnet Faucet Helper');
  console.log('================================\n');
  
  const walletAddress = process.env.WALLET_ADDRESS;
  
  if (!walletAddress) {
    console.error('❌ No wallet address found in .env file');
    process.exit(1);
  }
  
  console.log(`📄 Network: ${LINEA_TESTNET_CONFIG.name}`);
  console.log(`🔗 Chain ID: ${LINEA_TESTNET_CONFIG.chainId}`);
  console.log(`💳 Your Wallet: ${walletAddress}\n`);
  
  console.log('🚰 To get test ETH:');
  console.log(`1. Visit: ${LINEA_TESTNET_CONFIG.faucetUrl}`);
  console.log(`2. Connect your wallet or enter address: ${walletAddress}`);
  console.log(`3. Request 0.1 test ETH\n`);
  
  console.log('🔍 Track your transaction:');
  console.log(`Explorer: ${LINEA_TESTNET_CONFIG.explorerUrl}/address/${walletAddress}\n`);
  
  console.log('🌉 Bridge tokens from other networks:');
  console.log(`Bridge: ${LINEA_TESTNET_CONFIG.bridgeUrl}\n`);
  
  console.log('📋 Network Details for MetaMask:');
  console.log('--------------------------------');
  console.log(`Network Name: ${LINEA_TESTNET_CONFIG.name}`);
  console.log(`RPC URL: ${LINEA_TESTNET_CONFIG.rpcUrl}`);
  console.log(`Chain ID: ${LINEA_TESTNET_CONFIG.chainId}`);
  console.log(`Currency Symbol: ${LINEA_TESTNET_CONFIG.currency}`);
  console.log(`Explorer: ${LINEA_TESTNET_CONFIG.explorerUrl}`);
  
  console.log('\n✅ After getting test ETH, deploy your contract with:');
  console.log('npm run blockchain:deploy:linea-testnet');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { LINEA_TESTNET_CONFIG };