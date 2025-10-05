# Blockchain Contract Deployment Steps

## Prerequisites
- Node.js and npm installed
- A wallet with testnet/mainnet funds (for public networks)
- API keys for RPC providers and block explorers (optional for verification)

## Step 1: Set up Environment Variables
Edit the `.env` file in the Medchain/MedChain directory with the following variables:

```
PRIVATE_KEY=your_private_key_without_0x_prefix
POLYGON_RPC_URL=https://polygon-rpc.com
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
LINEA_RPC_URL=https://rpc.linea.build
LINEA_TESTNET_RPC_URL=https://rpc.goerli.linea.build
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
LINEASCAN_API_KEY=your_lineascan_api_key
INFURA_API_KEY=your_infura_api_key
```

**Security Note:** Never commit your .env file to version control. Ensure PRIVATE_KEY has funds for gas fees.

## Step 2: Install Dependencies
Run the following command to install all required packages:

```bash
npm install
```

## Step 3: Compile the Smart Contract
Compile the MediChainUserRegistry contract:

```bash
npm run blockchain:compile
```

This will generate artifacts in the `artifacts/` directory.

## Step 4: Choose Deployment Network
Available networks:
- `localhost`: Local Hardhat network (requires running `npm run blockchain:node` first)
- `mumbai`: Polygon Mumbai testnet
- `polygon`: Polygon mainnet
- `linea`: Linea mainnet
- `lineaTestnet`: Linea testnet
- `sepolia`: Ethereum Sepolia testnet
- `goerli`: Ethereum Goerli testnet (deprecated)
- `ethereum`: Ethereum mainnet

## Step 5: Deploy the Contract
Choose one of the following deployment commands based on your desired network:

### Local Deployment (Recommended for testing)
```bash
npm run blockchain:deploy:local
```

### Testnet Deployments
```bash
npm run blockchain:deploy:mumbai      # Polygon Mumbai testnet
npm run blockchain:deploy:linea-testnet  # Linea testnet
npm run blockchain:deploy:sepolia     # Ethereum Sepolia testnet
```

### Mainnet Deployments (Use with caution)
```bash
npm run blockchain:deploy:polygon     # Polygon mainnet
npm run blockchain:deploy:linea       # Linea mainnet
npm run blockchain:deploy:ethereum    # Ethereum mainnet
```

## Step 6: Verify Deployment
After deployment:
1. Check the console output for the contract address and transaction hash
2. Deployment information is saved to `deployments/{network}.json`
3. For public networks, the contract will be automatically verified on the respective block explorer

## Troubleshooting
- If deployment fails due to insufficient funds, add testnet tokens to your wallet
- For local deployment, ensure Hardhat node is running: `npm run blockchain:node`
- Check network connectivity and RPC URLs
- Verify PRIVATE_KEY format (64 characters, no 0x prefix)

## Next Steps
- Use the deployed contract address in your frontend/application
- Test contract interactions using Hardhat console or scripts
- Monitor contract on block explorer
