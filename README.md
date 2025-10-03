# 🏥 MediChain - Blockchain-Based Medical Records System

A secure, decentralized platform for managing medical records using blockchain technology, built for hackathons and healthcare innovation.

## 🌟 Features

- **Blockchain Security**: Immutable medical records stored on Polygon Mumbai testnet
- **Patient Privacy**: JWT-based authentication with role-based access control
- **AI-Powered Diagnostics**: Google AI integration for symptom checking
- **Multi-Network Support**: Polygon, Ethereum testnets, and Linea compatibility
- **Secure File Uploads**: Encrypted storage for medical documents
- **Real-time Updates**: Live blockchain transaction monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB
- MetaMask or compatible Web3 wallet
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/medichain.git
cd medichain

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if running locally)
mongod

# Run the application
npm start

# For development with hot reload
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:9002

# Database
MONGODB_URI=mongodb://localhost:27017/medichain

# Blockchain (Default: Polygon Mumbai)
ETHEREUM_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
WALLET_ADDRESS=your_wallet_address

# API Keys
INFURA_API_KEY=your_infura_api_key
GOOGLE_GENAI_API_KEY=your_google_ai_key

# Security
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Supported Networks

- **Primary**: Polygon Mumbai (Testnet)
- **Backup**: Ethereum Goerli, Sepolia
- **Alternative**: Linea Testnet

## 🏗️ Architecture

```
├── contracts/          # Smart contracts (Solidity)
├── backend/            # Node.js API server
├── frontend/           # React/Next.js frontend
├── scripts/            # Deployment scripts
├── test/               # Test files
└── uploads/            # File storage
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Medical Records
- `GET /api/records` - Get patient records
- `POST /api/records` - Create new record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Blockchain
- `POST /api/blockchain/deploy` - Deploy contracts
- `GET /api/blockchain/status` - Network status
- `POST /api/blockchain/transaction` - Submit transaction

## 🔧 Development

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run blockchain tests
npm run test:blockchain
```

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run scripts/deploy.js --network mumbai

# Verify contract
npx hardhat verify --network mumbai CONTRACT_ADDRESS
```

### Database Setup

```bash
# Start MongoDB locally
mongod --dbpath ./data/db

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

## 🚀 Deployment

### Local Development

```bash
npm run dev
```
Frontend: http://localhost:9002
Backend: http://localhost:3001

### Production Deployment

1. **Environment Setup**:
   ```bash
   NODE_ENV=production
   # Use secure JWT secrets
   # Use production MongoDB
   # Use mainnet RPC URLs
   ```

2. **Deploy Smart Contracts**:
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

3. **Build and Start**:
   ```bash
   npm run build
   npm start
   ```

## 🔐 Security Features

- **Encrypted Storage**: Medical data encrypted at rest
- **Access Control**: Role-based permissions (Patient, Doctor, Admin)
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data sanitization
- **Audit Trail**: Blockchain-based transaction logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Hackathon Ready

This project is optimized for hackathons with:
- ✅ Quick setup (< 10 minutes)
- ✅ Multiple testnet support
- ✅ Demo data generators
- ✅ Comprehensive API documentation
- ✅ Blockchain integration examples

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   ```

2. **Blockchain Connection Issues**:
   - Check RPC URL in `.env`
   - Verify network status
   - Try backup RPC endpoints

3. **File Upload Issues**:
   - Check `MAX_FILE_SIZE` in `.env`
   - Ensure `uploads/` directory exists

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/medichain/issues)
- **Email**: support@medichain.com
- **Documentation**: [Wiki](https://github.com/yourusername/medichain/wiki)

## 🏆 Acknowledgments

- Polygon for blockchain infrastructure
- Google AI for medical AI capabilities
- MongoDB for database solutions
- OpenZeppelin for smart contract security

---

**Built with ❤️ for healthcare innovation and blockchain technology**
