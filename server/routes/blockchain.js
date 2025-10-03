const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

// Try to load blockchain service, but don't fail if not configured
let blockchainService = null;
try {
  // Only load if we have valid configuration
  if (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length === 64 && process.env.PRIVATE_KEY !== 'your-wallet-private-key-for-deployment') {
    blockchainService = require('../services/blockchain');
  }
} catch (error) {
  console.log('⚠️  Blockchain service not available:', error.message);
}

const router = express.Router();

// Middleware to check if blockchain is available
const requireBlockchain = (req, res, next) => {
  if (!blockchainService) {
    return res.status(503).json({ 
      error: 'Blockchain service not configured',
      message: 'Please configure PRIVATE_KEY and other blockchain settings to use this feature'
    });
  }
  next();
};

// @route   GET /api/blockchain/status
// @desc    Get blockchain service status
// @access  Private
router.get('/status', authenticate, async (req, res) => {
  if (!blockchainService) {
    return res.json({
      available: false,
      initialized: false,
      message: 'Blockchain service not configured. Configure PRIVATE_KEY to enable blockchain features.'
    });
  }
  try {
    const isAvailable = blockchainService.isAvailable();
    
    let status = {
      available: isAvailable,
      initialized: blockchainService.initialized
    };

    if (isAvailable) {
      try {
        const [balance, gasPrice] = await Promise.all([
          blockchainService.getAccountBalance(),
          blockchainService.getCurrentGasPrice()
        ]);
        
        status = {
          ...status,
          walletBalance: `${balance} ETH`,
          gasPrice: gasPrice.gasPrice?.toString(),
          network: 'Connected'
        };
      } catch (error) {
        status.error = 'Connected but unable to fetch network info';
      }
    }

    res.json({ status });
  } catch (error) {
    console.error('Blockchain status error:', error);
    res.status(500).json({ error: 'Failed to get blockchain status' });
  }
});

// @route   GET /api/blockchain/verify/:userId
// @desc    Verify user on blockchain
// @access  Private (Admin or Self)
router.get('/verify/:userId', authenticate, requireBlockchain, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!blockchainService.isAvailable()) {
      return res.status(503).json({ error: 'Blockchain service not available' });
    }

    const verification = await blockchainService.verifyUser(userId);
    res.json({ verification });

  } catch (error) {
    console.error('Blockchain verification error:', error);
    res.status(500).json({ error: 'Blockchain verification failed' });
  }
});

// @route   GET /api/blockchain/consent/:userId
// @desc    Get user consent from blockchain
// @access  Private (Admin or Self)
router.get('/consent/:userId', authenticate, requireBlockchain, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!blockchainService.isAvailable()) {
      return res.status(503).json({ error: 'Blockchain service not available' });
    }

    const consent = await blockchainService.getUserConsent(userId);
    res.json({ consent });

  } catch (error) {
    console.error('Blockchain consent retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve consent from blockchain' });
  }
});

// @route   GET /api/blockchain/transaction/:txHash
// @desc    Get transaction details
// @access  Private
router.get('/transaction/:txHash', authenticate, requireBlockchain, async (req, res) => {
  try {
    const { txHash } = req.params;

    if (!blockchainService.isAvailable()) {
      return res.status(503).json({ error: 'Blockchain service not available' });
    }

    const receipt = await blockchainService.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      transaction: {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'Success' : 'Failed',
        confirmations: receipt.confirmations || 0
      }
    });

  } catch (error) {
    console.error('Transaction details error:', error);
    res.status(500).json({ error: 'Failed to get transaction details' });
  }
});

// @route   POST /api/blockchain/register-manual
// @desc    Manually register user on blockchain (Admin only)
// @access  Private (Admin)
router.post('/register-manual', 
  authenticate, 
  authorize('admin'),
  requireBlockchain, 
  async (req, res) => {
    try {
      const { userId, profileHash, email } = req.body;

      if (!userId || !profileHash || !email) {
        return res.status(400).json({ 
          error: 'userId, profileHash, and email are required' 
        });
      }

      if (!blockchainService.isAvailable()) {
        return res.status(503).json({ error: 'Blockchain service not available' });
      }

      // Check if user is already registered
      const isRegistered = await blockchainService.isUserRegistered(userId);
      if (isRegistered) {
        return res.status(400).json({ error: 'User already registered on blockchain' });
      }

      const txHash = await blockchainService.registerUser(userId, profileHash, email);
      
      res.json({
        message: 'User registered on blockchain successfully',
        transactionHash: txHash
      });

    } catch (error) {
      console.error('Manual blockchain registration error:', error);
      res.status(500).json({ error: 'Failed to register user on blockchain' });
    }
  }
);

// @route   GET /api/blockchain/gas-price
// @desc    Get current gas price
// @access  Private
router.get('/gas-price', authenticate, requireBlockchain, async (req, res) => {
  try {
    if (!blockchainService.isAvailable()) {
      return res.status(503).json({ error: 'Blockchain service not available' });
    }

    const gasPrice = await blockchainService.getCurrentGasPrice();
    
    res.json({
      gasPrice: {
        standard: gasPrice.gasPrice?.toString(),
        fast: gasPrice.maxFeePerGas?.toString(),
        priority: gasPrice.maxPriorityFeePerGas?.toString()
      }
    });

  } catch (error) {
    console.error('Gas price error:', error);
    res.status(500).json({ error: 'Failed to get gas price' });
  }
});

// @route   GET /api/blockchain/stats
// @desc    Get blockchain integration statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', authenticate, authorize('admin'), requireBlockchain, async (req, res) => {
  try {
    if (!blockchainService.isAvailable()) {
      return res.status(503).json({ error: 'Blockchain service not available' });
    }

    // Get wallet balance
    const balance = await blockchainService.getAccountBalance();
    
    // You can add more statistics here, such as:
    // - Total users registered on blockchain
    // - Total transactions made
    // - Gas usage statistics
    
    res.json({
      stats: {
        walletBalance: `${balance} ETH`,
        serviceStatus: 'Active',
        // Add more stats as needed
      }
    });

  } catch (error) {
    console.error('Blockchain stats error:', error);
    res.status(500).json({ error: 'Failed to get blockchain statistics' });
  }
});

module.exports = router;