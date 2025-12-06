const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║           NFT MARKETPLACE - DEPLOYMENT SCRIPT              ║");
  console.log("║                  Nosirov Mamurjon                          ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("🔑 Deployer manzili:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balans:", hre.ethers.formatEther(balance), "ETH");
  console.log("");

  // 1. ERC-20 Token deploy
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 1/3 - MyToken (ERC-20) deploy qilinmoqda...");
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy("Mamurjon Token", "MJT", 1000000);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ MyToken deployed:", tokenAddress);

  // 2. NFT Contract deploy
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 2/3 - MyNFT (ERC-721) deploy qilinmoqda...");
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy("Mamurjon NFT", "MJNFT");
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ MyNFT deployed:", nftAddress);

  // 3. Marketplace deploy
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 3/3 - NFTMarketplace deploy qilinmoqda...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ NFTMarketplace deployed:", marketplaceAddress);

  // Summary
  console.log("");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║                   DEPLOYMENT YAKUNLANDI!                   ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log("║ 👤 Owner:      ", deployer.address, "  ║");
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log("║ 📜 MyToken:    ", tokenAddress, "  ║");
  console.log("║ 🎨 MyNFT:      ", nftAddress, "  ║");
  console.log("║ 🏪 Marketplace:", marketplaceAddress, "  ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("⚠️  MUHIM: Bu manzillarni frontend/src/constants/contracts.ts ga ko'chiring!");
  console.log("");
  console.log("🔗 Etherscan'da ko'rish:");
  console.log("   https://sepolia.etherscan.io/address/" + marketplaceAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Xatolik:", error);
    process.exit(1);
  });
