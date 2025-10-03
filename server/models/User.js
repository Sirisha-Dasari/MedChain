const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  
  // Patient specific fields
  phoneNumber: {
    type: String,
    required: function() { return this.role === 'patient'; }
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: function() { return this.role === 'patient'; }
  },
  
  // Doctor specific fields
  certificate: {
    filename: String,
    path: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  licenseNumber: String,
  specialization: String,
  
  // Blockchain Integration
  blockchainHash: {
    type: String,
    index: true
  },
  consentHash: String,
  walletAddress: String,
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  lastLogin: Date,
  profileUpdatedAt: Date,
  
  // Privacy Settings
  dataConsent: {
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    research: { type: Boolean, default: false },
    sharing: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ blockchainHash: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    isVerified: this.isVerified,
    ...(this.role === 'patient' && {
      phoneNumber: this.phoneNumber,
      bloodType: this.bloodType
    }),
    ...(this.role === 'doctor' && {
      licenseNumber: this.licenseNumber,
      specialization: this.specialization,
      verified: this.certificate?.verified
    })
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, rounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate blockchain hash
userSchema.methods.generateBlockchainHash = function() {
  const crypto = require('crypto');
  const data = `${this.email}:${this.fullName}:${this.role}:${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);