# MediChain Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git
- MetaMask wallet (for blockchain testing)

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Minimum required:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (random string)
# - JWT_REFRESH_SECRET (random string)
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Install MongoDB (if running locally)
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow official MongoDB installation guide
```

### 3. Database Setup

```bash
# Start MongoDB (if local)
# Windows: mongod
# macOS/Linux: brew services start mongodb-community
# Or use MongoDB Atlas cloud service

# The application will automatically create the database and collections
```

### 4. Development Server

```bash
# Start both frontend and backend
npm run dev:full

# Or start individually:
npm run server:dev  # Backend on port 3001
npm run dev         # Frontend on port 9002
```

### 5. Blockchain Setup (Optional)

```bash
# Compile smart contracts
npm run blockchain:compile

# Run tests
npm run blockchain:test

# Start local blockchain node
npm run blockchain:node

# Deploy to local network (in separate terminal)
npm run blockchain:deploy:local
```

## 📱 Access Points

- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:3001
- **MongoDB**: mongodb://localhost:27017 (if local)

## 🔧 Configuration

### JWT Secrets
Generate secure JWT secrets:
```bash
# In Node.js console
require('crypto').randomBytes(64).toString('hex')
```

### MongoDB Connection
Choose one option:

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/medichain
```

**MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medichain
```

### Blockchain Configuration
For blockchain features, configure:
- `PRIVATE_KEY`: Wallet private key for deployment
- `INFURA_API_KEY`: Infura project API key
- Network RPC URLs

## 🧪 Testing

### Backend Tests
```bash
# Run server tests
npm test

# Test specific routes
curl http://localhost:3001/api/health
```

### Smart Contract Tests
```bash
# Run contract tests
npm run blockchain:test

# Test with coverage
npm run blockchain:test -- --coverage
```

### Frontend Testing
```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🚀 Deployment

### Smart Contract Deployment

**Mumbai Testnet:**
```bash
npm run blockchain:deploy:mumbai
```

**Polygon Mainnet:**
```bash
npm run blockchain:deploy:polygon
```

### Backend Deployment
1. Set production environment variables
2. Build application: `npm run build`
3. Start production server: `npm start`

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh tokens

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account

### Blockchain Integration
- `POST /api/blockchain/register-user` - Register user on blockchain
- `PUT /api/blockchain/update-profile` - Update blockchain profile
- `POST /api/blockchain/update-consent` - Update consent preferences

## 🛠️ Development Workflow

### Adding New Features
1. Create feature branch: `git checkout -b feature/feature-name`
2. Add backend routes in `server/routes/`
3. Add frontend components in `src/components/`
4. Update tests
5. Test locally with `npm run dev:full`
6. Create pull request

### Database Schema Changes
1. Update Mongoose models in `server/models/`
2. Test migration scripts
3. Update API documentation

### Smart Contract Changes
1. Modify contracts in `contracts/`
2. Update tests in `test/`
3. Run `npm run blockchain:test`
4. Deploy to testnet first

## 🔒 Security Checklist

- [ ] JWT secrets are properly configured
- [ ] Database connection is secured
- [ ] Private keys are not committed to git
- [ ] Rate limiting is configured
- [ ] CORS settings are properly set
- [ ] Input validation is implemented
- [ ] Password hashing is enabled

## 📦 Project Structure

```
med-main/
├── contracts/              # Smart contracts
├── server/                 # Backend Express server
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── services/          # Business logic services
├── src/                   # Frontend Next.js app
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   └── lib/              # Utility functions
├── scripts/              # Deployment scripts
├── test/                 # Smart contract tests
└── docs/                 # Documentation
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify connection string in .env
- Check firewall settings

**JWT Token Error:**
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser localStorage

**Blockchain Connection Error:**
- Check RPC URL configuration
- Verify private key format
- Ensure sufficient gas balance

**Port Already in Use:**
```bash
# Kill process on port
lsof -ti:3001 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3001   # Windows
```

### Debug Mode
Enable debug logging:
```
DEBUG_MODE=true
```

## 📞 Support

For development support:
1. Check existing issues in repository
2. Review documentation in `/docs`
3. Create new issue with detailed description

## 🔄 Updates

Keep dependencies updated:
```bash
npm update
npm audit
npm audit fix
```