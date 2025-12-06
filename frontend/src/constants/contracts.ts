// ============================================
// MUHIM: Deploy qilgandan keyin manzillarni yangilang!
// ============================================

export const OWNER_INFO = {
  name: "Nosirov Mamurjon",
  ownerAddress: "0x08236eE47b4dB1C9574609ea7B58749500B639aD" as `0x${string}`,
};

// Deploy qilgandan keyin bu manzillarni yangilang!
export const CONTRACTS = {
  TOKEN: {
    address: "0x3CcC821DB109F0b96B153c3402F9c685207dd10c" as `0x${string}`, // MyToken manzili
    abi: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
    ] as const,
  },
  NFT: {
    address: "0xAaD12968Fd5e99d6891780245c8b942c7Eb2e024" as `0x${string}`, // MyNFT manzili
    abi: [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function mintPrice() view returns (uint256)",
      "function mint(address to, string uri) payable returns (uint256)",
      "function freeMint(address to, string uri) returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function ownerOf(uint256 tokenId) view returns (address)",
      "function balanceOf(address owner) view returns (uint256)",
      "function totalSupply() view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function setApprovalForAll(address operator, bool approved)",
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
      "function approve(address to, uint256 tokenId)",
      "function getApproved(uint256 tokenId) view returns (address)",
    ] as const,
  },
  MARKETPLACE: {
    address: "0xC9ba44E2a31018CEbc438c3BB8897b802b87983D" as `0x${string}`, // Marketplace manzili
    abi: [
      "function listingCount() view returns (uint256)",
      "function platformFee() view returns (uint256)",
      "function listings(uint256) view returns (uint256 listingId, address seller, address nftContract, uint256 tokenId, uint256 price, bool isActive)",
      "function listItem(address nftContract, uint256 tokenId, uint256 price) returns (uint256)",
      "function buyItem(uint256 listingId) payable",
      "function cancelListing(uint256 listingId)",
      "function updatePrice(uint256 listingId, uint256 newPrice)",
      "function getActiveListings() view returns ((uint256 listingId, address seller, address nftContract, uint256 tokenId, uint256 price, bool isActive)[])",
      "function getListing(uint256 listingId) view returns ((uint256 listingId, address seller, address nftContract, uint256 tokenId, uint256 price, bool isActive))",
    ] as const,
  },
};
