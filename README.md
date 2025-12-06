# 🎨 NFT Marketplace - Nosirov Mamurjon

Ethereum blockchain asosida NFT Marketplace loyihasi.

## 📋 Loyiha Tarkibi

- **ERC-20 Token** (MyToken) - Mamurjon Token (MJT)
- **ERC-721 NFT** (MyNFT) - Mamurjon NFT Collection
- **NFT Marketplace** - NFT sotish va sotib olish platformasi

## 🚀 O'rnatish va Ishga Tushirish

### 1. Smart Contracts (Backend)

```bash
# Asosiy papkaga o'ting
cd nft-marketplace

# Dependencylarni o'rnating
npm install

# .env faylini yarating
cp .env.example .env

# .env faylini tahrirlang va PRIVATE_KEY ni qo'shing
# PRIVATE_KEY=your_metamask_private_key
```

**MetaMask Private Key olish:**
1. MetaMask oching
2. 3 nuqta (⋮) bosing
3. "Account details" → "Show private key"
4. Parolni kiriting
5. Private key ni nusxalang

```bash
# Contractlarni compile qilish
npm run compile

# Sepolia testnetga deploy qilish
npm run deploy
```

**MUHIM:** Deploy natijasidagi manzillarni yozib oling!

### 2. Frontend

```bash
# Frontend papkasiga o'ting
cd frontend

# Dependencylarni o'rnating
npm install

# src/constants/contracts.ts faylini oching
# Deploy qilgan manzillarni qo'shing:
# - TOKEN.address
# - NFT.address  
# - MARKETPLACE.address

# Development serverni ishga tushiring
npm run dev
```

http://localhost:3000 da ochiladi.

### 3. Vercel'ga Deploy

```bash
# Frontend papkasida
cd frontend

# Vercel CLI o'rnating (agar yo'q bo'lsa)
npm install -g vercel

# Deploy qiling
vercel
```

Yoki https://vercel.com da GitHub repo ni ulang.

## 📁 Fayl Strukturasi

```
nft-marketplace/
├── contracts/
│   ├── MyToken.sol          # ERC-20 token
│   ├── MyNFT.sol             # ERC-721 NFT
│   └── NFTMarketplace.sol    # Marketplace
├── scripts/
│   └── deploy.js             # Deploy script
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Asosiy sahifa
│   │   │   ├── layout.tsx    # Layout
│   │   │   ├── providers.tsx # Web3 providers
│   │   │   └── globals.css   # Styles
│   │   ├── config/
│   │   │   └── wagmi.ts      # Wagmi config
│   │   └── constants/
│   │       └── contracts.ts  # Contract addresses & ABIs
│   └── package.json
├── hardhat.config.js
├── package.json
└── README.md
```

## 🔗 Kerakli Linklar

- **Sepolia Faucet:** https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- **Sepolia Etherscan:** https://sepolia.etherscan.io
- **WalletConnect:** https://cloud.walletconnect.com

## 👤 Ma'lumotlar

- **Yaratuvchi:** Nosirov Mamurjon
- **Owner Address:** 0x08236eE47b4dB1C9574609ea7B58749500B639aD
- **Network:** Sepolia Testnet

## 📜 Litsenziya

MIT License
