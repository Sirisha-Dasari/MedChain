const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Session = require('../models/Session');
const { authenticate } = require('../middleware/auth');
const blockchainService = require('../services/blockchain');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  return { accessToken, refreshToken };
};

// Helper function to extract device info
const getDeviceInfo = (req) => {
  const userAgent = req.get('User-Agent') || '';
  return {
    userAgent,
    ip: req.ip,
    device: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
    browser: userAgent.split('/')[0],
    os: userAgent.includes('Windows') ? 'Windows' : 
        userAgent.includes('Mac') ? 'macOS' : 
        userAgent.includes('Linux') ? 'Linux' : 'Unknown'
  };
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', 
  authLimiter,
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('role')
      .isIn(['patient', 'doctor'])
      .withMessage('Invalid role specified'),
    
    body('phoneNumber')
      .if(body('role').equals('patient'))
      .notEmpty()
      .withMessage('Phone number is required for patients'),
    
    body('bloodType')
      .if(body('role').equals('patient'))
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { fullName, email, password, role, phoneNumber, bloodType } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Create user data
      const userData = {
        fullName,
        email,
        password,
        role
      };

      // Add role-specific fields
      if (role === 'patient') {
        userData.phoneNumber = phoneNumber;
        userData.bloodType = bloodType;
      }

      // Create user
      const user = new User(userData);
      user.blockchainHash = user.generateBlockchainHash();

      await user.save();

      // Store user profile hash on blockchain
      try {
        const txHash = await blockchainService.registerUser(
          user._id.toString(),
          user.blockchainHash,
          user.email
        );
        console.log(`✅ User registered on blockchain: ${txHash}`);
      } catch (blockchainError) {
        console.error('⚠️  Blockchain registration failed:', blockchainError.message);
        // Continue without blockchain - this is optional
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);
      
      // Create session
      const session = new Session({
        userId: user._id,
        token: accessToken,
        refreshToken,
        deviceInfo: getDeviceInfo(req),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      await session.save();

      res.status(201).json({
        message: 'User registered successfully',
        user: user.profile,
        token: accessToken,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }
      
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findByEmail(email).select('+password');
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user._id);
      
      // Create session
      const session = new Session({
        userId: user._id,
        token: accessToken,
        refreshToken,
        deviceInfo: getDeviceInfo(req),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });
      
      await session.save();

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        message: 'Login successful',
        user: user.profile,
        token: accessToken,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate current session)
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Invalidate current session
    req.session.isActive = false;
    await req.session.save();

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    // Invalidate all user sessions
    await Session.revokeUserSessions(req.user._id);

    res.json({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public (with refresh token)
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Find active session
    const session = await Session.findOne({
      refreshToken,
      userId: decoded.userId,
      isActive: true
    });

    if (!session || session.isExpired()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
    
    // Update session
    session.token = accessToken;
    session.refreshToken = newRefreshToken;
    session.lastAccessedAt = new Date();
    await session.save();

    res.json({
      token: accessToken,
      refreshToken: newRefreshToken,
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: req.user.profile,
      session: {
        lastLogin: req.user.lastLogin,
        device: req.session.deviceInfo
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// @route   GET /api/auth/sessions
// @desc    Get all active sessions
// @access  Private
router.get('/sessions', authenticate, async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).select('deviceInfo createdAt lastAccessedAt').sort({ lastAccessedAt: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;