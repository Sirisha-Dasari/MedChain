#!/usr/bin/env node

/**
 * Network Selector Script
 * 
 * Allows you to easily switch between different blockchain networks
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const NETWORKS = {
  mumbai: {
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/e3b0e7d00bdd4cf58056cf63831eb8d1',
    chainId: 80001,
    currency: 'MATIC',
    faucet: 'https://faucet.polygon.technology',
    explorer: 'https://mumbai.polygonscan.com'
  },
  linea: {
    name: 'Linea Goerli Testnet',
    rpcUrl: 'https://rpc.goerli.linea.build',
    chainId: 59140,
    currency: 'ETH',
    faucet: 'https://faucet.goerli.linea.build',
    explorer: 'https://goerli.lineascan.build'
  },
  sepolia: {
    name: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/e3b0e7d00bdd4cf58056cf63831eb8d1',
    chainId: 11155111,
    currency: 'ETH',
    faucet: 'https://sepoliafaucet.com',
    explorer: 'https://sepolia.etherscan.io'
  }
};

async function updateEnvNetwork(networkKey) {
  const network = NETWORKS[networkKey];
  if (!network) {
    console.error(`❌ Network '${networkKey}' not found`);
    return false;
  }
  
  try {
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update ETHEREUM_RPC_URL to the selected network
    envContent = envContent.replace(
      /ETHEREUM_RPC_URL=.*/,
      `ETHEREUM_RPC_URL=${network.rpcUrl}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log(`✅ Network switched to: ${network.name}`);
    console.log(`🔗 RPC URL: ${network.rpcUrl}`);
    console.log(`⛓️  Chain ID: ${network.chainId}`);
    console.log(`💰 Currency: ${network.currency}`);
    console.log(`🚰 Faucet: ${network.faucet}`);
    console.log(`🔍 Explorer: ${network.explorer}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update .env file:', error.message);
    return false;
  }
}

function showNetworks() {
  console.log('🔗 Available Networks:');
  console.log('=====================\n');
  
  Object.entries(NETWORKS).forEach(([key, network]) => {
    console.log(`${key}:`);
    console.log(`  Name: ${network.name}`);
    console.log(`  Chain ID: ${network.chainId}`);
    console.log(`  Currency: ${network.currency}`);
    console.log(`  Faucet: ${network.faucet}`);
    console.log('');
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'list') {
    showNetworks();
    console.log('Usage: node scripts/select-network.js <network>');
    console.log('Example: node scripts/select-network.js mumbai');
    return;
  }
  
  if (command === 'current') {
    const currentRpc = process.env.ETHEREUM_RPC_URL;
    const currentNetwork = Object.entries(NETWORKS).find(([key, network]) => 
      currentRpc && currentRpc.includes(network.rpcUrl.split('/').slice(-2, -1)[0])
    );
    
    if (currentNetwork) {
      console.log(`📍 Current network: ${currentNetwork[1].name}`);
    } else {
      console.log('📍 Current network: Custom or not recognized');
      console.log(`RPC URL: ${currentRpc}`);
    }
    return;
  }
  
  await updateEnvNetwork(command);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { NETWORKS, updateEnvNetwork };