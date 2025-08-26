# 🌍 World Citizenship NFT - Universal Passport

A universal identity NFT project on the Stacks blockchain. Every person can obtain a unique "World Citizen NFT" to gain belonging beyond national borders.

## 🌟 Project Description

This project brings the concept of universal citizenship to life using blockchain technology. Each user gets:

- **Unique NFT**: A one-of-a-kind identity NFT on the Stacks blockchain
- **Universal Identity**: Identity verification valid beyond national borders
- **DAO Voting Rights**: Ability to vote in universal DAOs
- **Global Participation**: Right to participate in worldwide social projects

## 🚀 Features

### Smart Contract (Clarity)
- ✅ Unique NFT guarantee for each user
- ✅ Metadata management (name, description, image)
- ✅ Transfer functions
- ✅ DAO voting rights control
- ✅ Universal identity verification

### Frontend (Next.js + React)
- ✅ Modern and responsive design
- ✅ Stacks wallet integration (Hiro, Xverse)
- ✅ NFT minting operations
- ✅ Citizenship status check
- ✅ Multi-language support (English/Turkish)
- ✅ Social features and community interaction
- ✅ DAO governance system

### Blockchain Integration
- ✅ Stacks.js libraries
- ✅ Testnet/Mainnet support
- ✅ Secure transaction management

## 🛠️ Technology Stack

- **Blockchain**: Stacks (Clarity smart contracts)
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Wallet**: Hiro Wallet, Xverse
- **Blockchain SDK**: Stacks.js
- **Development**: Clarinet
- **Internationalization**: Custom i18n implementation

## 📦 Installation

### Requirements
- Node.js 18+
- npm or yarn
- Clarinet (Stacks development tool)

### Step 1: Clone the Project
```bash
git clone <repository-url>
cd world-citizenship-nft
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.world-citizenship-nft
NEXT_PUBLIC_NETWORK=testnet
```

### Step 4: Clarinet Setup
```bash
# Install Clarinet (if not already installed)
curl -L https://raw.githubusercontent.com/hirosystems/clarinet/master/install.sh | bash

# Start Clarinet
clarinet start
```

### Step 5: Deploy Smart Contract
```bash
# Check contract
clarinet check

# Deploy contract
clarinet deploy
```

### Step 6: Start Frontend
```bash
npm run dev
```

The application will run at http://localhost:3000.

## 🔧 Development

### Smart Contract Development
```bash
# Test contract
clarinet test

# Open Clarinet console
clarinet console

# Redeploy contract
clarinet deploy
```

### Frontend Development
```bash
# Development server
npm run dev

# Build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## 📋 Usage

### 1. Connect Wallet
- Install Hiro Wallet or Xverse wallet
- Click "Connect Wallet" button
- Connect your wallet

### 2. Apply for Citizenship
- Enter your name and description
- Optionally add profile image URL
- Click "Create Citizenship NFT" button
- Confirm the transaction

### 3. View NFT
- After successful minting, you can view your NFT
- Token ID and metadata information are displayed

### 4. Transfer Operations
- You can transfer your NFT to another address
- Wallet confirmation required for transfer

## 🏛️ DAO Features

- **Proposal Creation**: Create governance proposals
- **Voting System**: Vote on active proposals
- **Community Governance**: Participate in decentralized decision-making
- **Social Interaction**: Comment and engage with proposals

## 👥 Social Features

- **Community Hub**: Connect with other world citizens
- **Events**: Participate in global events and meetups
- **Messaging**: Direct communication with community members
- **Profiles**: Customizable user profiles with badges and achievements

## 🔒 Security

### Smart Contract Security
- ✅ Each user can only mint one NFT
- ✅ Only owner can perform transfers
- ✅ Limited contract owner permissions
- ✅ Error conditions are handled

### Frontend Security
- ✅ Secure wallet connection
- ✅ Transaction confirmations from user
- ✅ Input validation
- ✅ Error handling

## 🌐 Network Support

- **Testnet**: For development and testing
- **Mainnet**: For live usage

To change networks, update the `NEXT_PUBLIC_NETWORK` environment variable.

## 📊 Contract Functions

### Public Functions
- `mint-citizenship`: Create new citizenship NFT
- `transfer-citizenship`: Transfer NFT
- `set-base-uri`: Update base URI (owner only)
- `update-token-metadata`: Update metadata (owner only)

### Read-Only Functions
- `has-citizenship`: Check citizenship status
- `get-token-metadata`: Get NFT metadata
- `get-total-supply`: Get total supply
- `can-vote-in-dao`: Check DAO voting rights
- `verify-world-citizen`: Verify world citizen

## 🌍 Multi-Language Support

The application supports multiple languages:
- **English** (default)
- **Turkish**

Language can be switched from the top-right corner of the interface.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- **Documentation**: This README file
- **Issues**: GitHub Issues page
- **Community**: Stacks Discord community

## 🔮 Future Plans

- [x] DAO integration
- [x] Multi-language support
- [x] Social features
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] API endpoints
- [ ] Advanced gamification

## 📞 Contact

- **Project**: World Citizenship NFT
- **GitHub**: [Repository URL]
- **Website**: [Coming Soon]

---

**Note**: This project is for educational purposes and may require additional security measures for real-world usage.

## 🏗️ Project Structure

```
world-citizenship-nft/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── dao/               # DAO governance
│   ├── community/         # Community features
│   ├── profile/           # User profiles
│   ├── messages/          # Messaging system
│   └── events/            # Events and announcements
├── components/            # Reusable React components
├── contexts/              # React contexts (Wallet, Language)
├── contracts/             # Clarity smart contracts
├── lib/                   # Utility libraries
├── public/                # Static assets and translations
└── types/                 # TypeScript type definitions
```