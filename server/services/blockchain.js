const { ethers } = require('ethers');

// Smart Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  "function registerUser(string userId, string profileHash, string email) external returns (bool)",
  "function updateUserProfile(string userId, string newProfileHash) external returns (bool)",
  "function updateConsent(string userId, string consentHash, bool analytics, bool marketing, bool research, bool sharing) external returns (bool)",
  "function verifyUser(string userId) external view returns (bool, string, uint256)",
  "function getUserConsent(string userId) external view returns (bool, bool, bool, bool, string)",
  "function isUserRegistered(string userId) external view returns (bool)",
  "event UserRegistered(string indexed userId, string profileHash, uint256 timestamp)",
  "event ProfileUpdated(string indexed userId, string newProfileHash, uint256 timestamp)",
  "event ConsentUpdated(string indexed userId, string consentHash, uint256 timestamp)"
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.wallet = null;
    this.initialized = false;
  }

  // Initialize blockchain connection
  async initialize() {
    try {
      if (!process.env.ETHEREUM_RPC_URL || !process.env.PRIVATE_KEY) {
        console.log('⚠️  Blockchain configuration missing - running without blockchain integration');
        return false;
      }

      // Connect to blockchain network
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      
      // Create wallet instance
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      
      // Connect to smart contract
      if (process.env.CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.wallet
        );
      }

      // Test connection
      const network = await this.provider.getNetwork();
      console.log(`✅ Connected to blockchain network: ${network.name} (Chain ID: ${network.chainId})`);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error.message);
      return false;
    }
  }

  // Check if blockchain is available
  isAvailable() {
    return this.initialized && this.contract !== null;
  }

  // Register new user on blockchain
  async registerUser(userId, profileHash, email) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      console.log(`📝 Registering user ${userId} on blockchain...`);
      
      const tx = await this.contract.registerUser(userId, profileHash, email, {
        gasLimit: 200000,
        gasPrice: ethers.parseUnits('20', 'gwei')
      });

      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      
      console.log(`✅ User registered on blockchain. Gas used: ${receipt.gasUsed}`);
      return tx.hash;
    } catch (error) {
      console.error('❌ Blockchain registration failed:', error);
      throw new Error(`Blockchain registration failed: ${error.message}`);
    }
  }

  // Update user profile on blockchain
  async updateUserProfile(userId, newProfileHash) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      console.log(`📝 Updating user profile ${userId} on blockchain...`);
      
      const tx = await this.contract.updateUserProfile(userId, newProfileHash, {
        gasLimit: 150000,
        gasPrice: ethers.parseUnits('20', 'gwei')
      });

      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      
      console.log(`✅ Profile updated on blockchain. Gas used: ${receipt.gasUsed}`);
      return tx.hash;
    } catch (error) {
      console.error('❌ Blockchain profile update failed:', error);
      throw new Error(`Blockchain profile update failed: ${error.message}`);
    }
  }

  // Update consent preferences on blockchain
  async updateConsent(userId, consentHash, consentData) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      console.log(`📝 Updating consent for user ${userId} on blockchain...`);
      
      const tx = await this.contract.updateConsent(
        userId,
        consentHash,
        consentData.analytics || false,
        consentData.marketing || false,
        consentData.research || false,
        consentData.sharing || false,
        {
          gasLimit: 180000,
          gasPrice: ethers.parseUnits('20', 'gwei')
        }
      );

      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      
      console.log(`✅ Consent updated on blockchain. Gas used: ${receipt.gasUsed}`);
      return tx.hash;
    } catch (error) {
      console.error('❌ Blockchain consent update failed:', error);
      throw new Error(`Blockchain consent update failed: ${error.message}`);
    }
  }

  // Verify user on blockchain
  async verifyUser(userId) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      console.log(`🔍 Verifying user ${userId} on blockchain...`);
      
      const [isRegistered, profileHash, timestamp] = await this.contract.verifyUser(userId);
      
      return {
        isRegistered,
        profileHash,
        registrationTime: new Date(Number(timestamp) * 1000),
        blockchainVerified: true
      };
    } catch (error) {
      console.error('❌ Blockchain verification failed:', error);
      throw new Error(`Blockchain verification failed: ${error.message}`);
    }
  }

  // Get user consent from blockchain
  async getUserConsent(userId) {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service not available');
    }

    try {
      console.log(`🔍 Getting consent for user ${userId} from blockchain...`);
      
      const [analytics, marketing, research, sharing, consentHash] = await this.contract.getUserConsent(userId);
      
      return {
        analytics,
        marketing,
        research,
        sharing,
        consentHash,
        blockchainVerified: true
      };
    } catch (error) {
      console.error('❌ Blockchain consent retrieval failed:', error);
      throw new Error(`Blockchain consent retrieval failed: ${error.message}`);
    }
  }

  // Check if user is registered on blockchain
  async isUserRegistered(userId) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const isRegistered = await this.contract.isUserRegistered(userId);
      return isRegistered;
    } catch (error) {
      console.error('❌ Blockchain registration check failed:', error);
      return false;
    }
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash) {
    if (!this.provider) {
      throw new Error('Blockchain provider not available');
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('❌ Failed to get transaction receipt:', error);
      throw new Error(`Failed to get transaction receipt: ${error.message}`);
    }
  }

  // Get current gas price
  async getCurrentGasPrice() {
    if (!this.provider) {
      throw new Error('Blockchain provider not available');
    }

    try {
      const feeData = await this.provider.getFeeData();
      return {
        gasPrice: feeData.gasPrice,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
      };
    } catch (error) {
      console.error('❌ Failed to get gas price:', error);
      throw new Error(`Failed to get gas price: ${error.message}`);
    }
  }

  // Get account balance
  async getAccountBalance() {
    if (!this.wallet) {
      throw new Error('Wallet not available');
    }

    try {
      const balance = await this.wallet.provider.getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Failed to get account balance:', error);
      throw new Error(`Failed to get account balance: ${error.message}`);
    }
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

// Initialize on module load
blockchainService.initialize().catch(console.error);

module.exports = blockchainService;