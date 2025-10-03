const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const blockchainService = require('../services/blockchain');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/certificates');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `certificate-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  authenticate,
  [
    body('fullName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid phone number'),
    
    body('bloodType')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { fullName, phoneNumber, bloodType, licenseNumber, specialization } = req.body;
      
      const user = await User.findById(req.user._id);
      
      // Update allowed fields
      if (fullName) user.fullName = fullName;
      
      // Role-specific updates
      if (user.role === 'patient') {
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bloodType) user.bloodType = bloodType;
      }
      
      if (user.role === 'doctor') {
        if (licenseNumber) user.licenseNumber = licenseNumber;
        if (specialization) user.specialization = specialization;
      }

      user.profileUpdatedAt = new Date();
      
      // Update blockchain hash if profile changed
      const newHash = user.generateBlockchainHash();
      if (newHash !== user.blockchainHash) {
        user.blockchainHash = newHash;
        
        try {
          const txHash = await blockchainService.updateUserProfile(
            user._id.toString(),
            newHash
          );
          console.log(`✅ Profile updated on blockchain: ${txHash}`);
        } catch (blockchainError) {
          console.error('⚠️  Blockchain update failed:', blockchainError.message);
        }
      }

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: user.profile
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// @route   POST /api/users/upload-certificate
// @desc    Upload doctor certificate
// @access  Private (Doctor only)
router.post('/upload-certificate',
  authenticate,
  authorize('doctor'),
  upload.single('certificate'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Certificate file is required' });
      }

      const user = await User.findById(req.user._id);
      
      // Remove old certificate file if exists
      if (user.certificate && user.certificate.path) {
        try {
          await fs.unlink(user.certificate.path);
        } catch (err) {
          console.log('Old certificate file not found or could not be deleted');
        }
      }

      // Update user with new certificate info
      user.certificate = {
        filename: req.file.filename,
        path: req.file.path,
        verified: false
      };

      await user.save();

      res.json({
        message: 'Certificate uploaded successfully',
        certificate: {
          filename: req.file.filename,
          uploadedAt: new Date(),
          verified: false
        }
      });

    } catch (error) {
      console.error('Certificate upload error:', error);
      res.status(500).json({ error: 'Failed to upload certificate' });
    }
  }
);

// @route   PUT /api/users/consent
// @desc    Update data consent preferences
// @access  Private
router.put('/consent',
  authenticate,
  [
    body('analytics').optional().isBoolean(),
    body('marketing').optional().isBoolean(),
    body('research').optional().isBoolean(),
    body('sharing').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { analytics, marketing, research, sharing } = req.body;
      const user = await User.findById(req.user._id);

      // Update consent preferences
      if (analytics !== undefined) user.dataConsent.analytics = analytics;
      if (marketing !== undefined) user.dataConsent.marketing = marketing;
      if (research !== undefined) user.dataConsent.research = research;
      if (sharing !== undefined) user.dataConsent.sharing = sharing;

      // Update blockchain consent hash
      try {
        const consentData = JSON.stringify(user.dataConsent);
        const crypto = require('crypto');
        const consentHash = crypto.createHash('sha256').update(consentData).digest('hex');
        
        const txHash = await blockchainService.updateConsent(
          user._id.toString(),
          consentHash,
          user.dataConsent
        );
        
        user.consentHash = consentHash;
        console.log(`✅ Consent updated on blockchain: ${txHash}`);
      } catch (blockchainError) {
        console.error('⚠️  Blockchain consent update failed:', blockchainError.message);
      }

      await user.save();

      res.json({
        message: 'Consent preferences updated successfully',
        dataConsent: user.dataConsent
      });

    } catch (error) {
      console.error('Update consent error:', error);
      res.status(500).json({ error: 'Failed to update consent' });
    }
  }
);

// @route   GET /api/users/all
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/all',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, role, verified } = req.query;
      
      const query = {};
      if (role) query.role = role;
      if (verified !== undefined) query.isVerified = verified === 'true';

      const users = await User.find(query)
        .select('-password')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        users: users.map(user => user.profile),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

// @route   PUT /api/users/:id/verify
// @desc    Verify user (Admin only)
// @access  Private (Admin)
router.put('/:id/verify',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { verified } = req.body;
      
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.isVerified = verified;
      
      // For doctors, also verify certificate
      if (user.role === 'doctor' && verified && user.certificate) {
        user.certificate.verified = true;
      }

      await user.save();

      res.json({
        message: `User ${verified ? 'verified' : 'unverified'} successfully`,
        user: user.profile
      });

    } catch (error) {
      console.error('Verify user error:', error);
      res.status(500).json({ error: 'Failed to verify user' });
    }
  }
);

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    
    // Verify password before deletion
    const user = await User.findById(req.user._id).select('+password');
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete certificate file if exists
    if (user.certificate && user.certificate.path) {
      try {
        await fs.unlink(user.certificate.path);
      } catch (err) {
        console.log('Certificate file could not be deleted');
      }
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.email = `deleted_${user._id}@deleted.com`;
    await user.save();

    // Invalidate all sessions
    await Session.revokeUserSessions(user._id);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;