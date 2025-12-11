"use client";

// @ts-nocheck

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState, useEffect } from "react";
import { CONTRACTS, OWNER_INFO } from "@/constants/contracts";

// Listing type
interface Listing {
  listingId: bigint;
  seller: string;
  nftContract: string;
  tokenId: bigint;
  price: bigint;
  isActive: boolean;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"home" | "marketplace" | "mint" | "my-nfts">("home");
  const [mintUri, setMintUri] = useState("");
  const [listTokenId, setListTokenId] = useState("");
  const [listPrice, setListPrice] = useState("");

  // Contract reads
  const { data: mintPrice } = useReadContract({
    address: CONTRACTS.NFT.address,
    abi: CONTRACTS.NFT.abi,
    functionName: "mintPrice",
  });

  const { data: listings, refetch: refetchListings } = useReadContract({
    address: CONTRACTS.MARKETPLACE.address,
    abi: CONTRACTS.MARKETPLACE.abi,
    functionName: "getActiveListings",
  });

  const { data: userNFTBalance } = useReadContract({
    address: CONTRACTS.NFT.address,
    abi: CONTRACTS.NFT.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: isApproved } = useReadContract({
    address: CONTRACTS.NFT.address,
    abi: CONTRACTS.NFT.abi,
    functionName: "isApprovedForAll",
    args: address ? [address, CONTRACTS.MARKETPLACE.address] : undefined,
  });

  const { data: tokenBalance } = useReadContract({
    address: CONTRACTS.TOKEN.address,
    abi: CONTRACTS.TOKEN.abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Contract writes
  const { writeContract: mint, data: mintHash, isPending: isMinting } = useWriteContract();
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContract: listItem, data: listHash, isPending: isListing } = useWriteContract();
  const { writeContract: buyItem, data: buyHash, isPending: isBuying } = useWriteContract();
  const { writeContract: cancelListing, isPending: isCanceling } = useWriteContract();

  // Transaction receipts
  const { isSuccess: mintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });
  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: listSuccess } = useWaitForTransactionReceipt({ hash: listHash });
  const { isSuccess: buySuccess } = useWaitForTransactionReceipt({ hash: buyHash });

  // Refetch on success
  useEffect(() => {
    if (mintSuccess || listSuccess || buySuccess || approveSuccess) {
      refetchListings();
      setMintUri("");
      setListTokenId("");
      setListPrice("");
    }
  }, [mintSuccess, listSuccess, buySuccess, approveSuccess, refetchListings]);

  // Handlers
  const handleMint = () => {
    if (!mintUri || !mintPrice) return;
    mint({
      address: CONTRACTS.NFT.address,
      abi: CONTRACTS.NFT.abi,
      functionName: "mint",
      args: [address!, mintUri],
      value: mintPrice as bigint,
    });
  };

  const handleApprove = () => {
    approve({
      address: CONTRACTS.NFT.address,
      abi: CONTRACTS.NFT.abi,
      functionName: "setApprovalForAll",
      args: [CONTRACTS.MARKETPLACE.address, true],
    });
  };

  const handleList = () => {
    if (!listTokenId || !listPrice) return;
    listItem({
      address: CONTRACTS.MARKETPLACE.address,
      abi: CONTRACTS.MARKETPLACE.abi,
      functionName: "listItem",
      args: [CONTRACTS.NFT.address, BigInt(listTokenId), parseEther(listPrice)],
    });
  };

  const handleBuy = (listingId: bigint, price: bigint) => {
    buyItem({
      address: CONTRACTS.MARKETPLACE.address,
      abi: CONTRACTS.MARKETPLACE.abi,
      functionName: "buyItem",
      args: [listingId],
      value: price,
    });
  };

  const handleCancel = (listingId: bigint) => {
    cancelListing({
      address: CONTRACTS.MARKETPLACE.address,
      abi: CONTRACTS.MARKETPLACE.abi,
      functionName: "cancelListing",
      args: [listingId],
    });
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎨</span>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Owner Info Banner - MUHIM! */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-purple-400 uppercase tracking-wide">Yaratuvchi</p>
              <p className="text-lg font-bold text-white">👤 {OWNER_INFO.name}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-purple-400 uppercase tracking-wide">Marketplace Contract</p>
              <p className="text-sm font-mono text-white truncate">
                📜 {CONTRACTS.MARKETPLACE.address}
              </p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-xs text-purple-400 uppercase tracking-wide">Owner Address</p>
              <p className="text-sm font-mono text-white truncate">
                👛 {OWNER_INFO.ownerAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "home", label: "🏠 Bosh sahifa", icon: "🏠" },
            { id: "marketplace", label: "🏪 Bozor", icon: "🏪" },
            { id: "mint", label: "✨ Mint", icon: "✨" },
            { id: "my-nfts", label: "🖼️ Mening NFT'larim", icon: "🖼️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Home Tab */}
        {activeTab === "home" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                NFT Marketplace ga Xush Kelibsiz!
              </h2>
              <p className="text-xl text-gray-400">
                Ethereum blockchain asosida NFT yaratish va sotish platformasi
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/20">
                <p className="text-4xl mb-2">🎨</p>
                <p className="text-3xl font-bold text-white">ERC-721</p>
                <p className="text-gray-400">NFT Standarti</p>
              </div>
              <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 rounded-2xl p-6 border border-pink-500/20">
                <p className="text-4xl mb-2">💰</p>
                <p className="text-3xl font-bold text-white">ERC-20</p>
                <p className="text-gray-400">Token Standarti</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-2xl p-6 border border-indigo-500/20">
                <p className="text-4xl mb-2">🔗</p>
                <p className="text-3xl font-bold text-white">Sepolia</p>
                <p className="text-gray-400">Test Network</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">Imkoniyatlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: "✨", title: "NFT Mint", desc: "O'z NFT'laringizni yarating" },
                  { icon: "🏪", title: "Marketplace", desc: "NFT'larni sotib oling va soting" },
                  { icon: "💼", title: "Hamyon", desc: "MetaMask bilan ulaning" },
                  { icon: "🔒", title: "Xavfsiz", desc: "Smart contract bilan himoyalangan" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="text-sm text-gray-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === "marketplace" && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">🏪 Sotuvdagi NFT'lar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(listings as Listing[] || []).map((listing, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative">
                    <span className="text-7xl">🎨</span>
                    <div className="absolute top-3 right-3 bg-black/50 px-2 py-1 rounded-lg">
                      <span className="text-xs text-white">#{listing.tokenId.toString()}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Narxi</span>
                      <span className="text-lg font-bold text-white">
                        {formatEther(listing.price)} ETH
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-4">
                      Sotuvchi: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                    </p>
                    {isConnected && listing.seller.toLowerCase() !== address?.toLowerCase() && (
                      <button
                        onClick={() => handleBuy(listing.listingId, listing.price)}
                        disabled={isBuying}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all"
                      >
                        {isBuying ? "⏳ Kutilmoqda..." : "🛒 Sotib olish"}
                      </button>
                    )}
                    {isConnected && listing.seller.toLowerCase() === address?.toLowerCase() && (
                      <button
                        onClick={() => handleCancel(listing.listingId)}
                        disabled={isCanceling}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-all"
                      >
                        {isCanceling ? "⏳ Kutilmoqda..." : "❌ Bekor qilish"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!listings || (listings as Listing[]).length === 0) && (
                <div className="col-span-full text-center py-16">
                  <span className="text-6xl mb-4 block">🏜️</span>
                  <p className="text-gray-400 text-xl">Hozircha sotuvda NFT yo'q</p>
                  <p className="text-gray-500 mt-2">Birinchi bo'lib NFT joylashtiring!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mint Tab */}
        {activeTab === "mint" && (
          <div className="max-w-lg mx-auto">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-3xl font-bold text-white mb-2">✨ Yangi NFT Yaratish</h2>
              <p className="text-gray-400 mb-8">O'z NFT'ingizni mint qiling</p>

              {!isConnected ? (
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">🔗</span>
                  <p className="text-gray-400 mb-4">Avval hamyoningizni ulang</p>
                  <ConnectButton />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Metadata URI
                    </label>
                    <input
                      type="text"
                      value={mintUri}
                      onChange={(e) => setMintUri(e.target.value)}
                      placeholder="ipfs://... yoki https://..."
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Masalan: ipfs://QmExample... yoki https://example.com/metadata.json
                    </p>
                  </div>

                  <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Mint narxi:</span>
                      <span className="text-xl font-bold text-white">
                        {mintPrice ? formatEther(mintPrice as bigint) : "..."} ETH
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleMint}
                    disabled={!mintUri || isMinting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all text-lg"
                  >
                    {isMinting ? "⏳ Mint qilinmoqda..." : "✨ Mint qilish"}
                  </button>

                  {mintSuccess && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
                      <span className="text-green-400">✅ NFT muvaffaqiyatli yaratildi!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* My NFTs Tab */}
        {activeTab === "my-nfts" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-3xl font-bold text-white mb-2">🖼️ Mening NFT'larim</h2>
              <p className="text-gray-400 mb-8">NFT'laringizni boshqaring va sotuvga qo'ying</p>

              {!isConnected ? (
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">🔗</span>
                  <p className="text-gray-400 mb-4">Avval hamyoningizni ulang</p>
                  <ConnectButton />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-900/20 rounded-xl p-4 text-center border border-purple-500/20">
                      <p className="text-3xl font-bold text-white">
                        {userNFTBalance?.toString() || "0"}
                      </p>
                      <p className="text-sm text-gray-400">NFT'lar</p>
                    </div>
                    <div className="bg-pink-900/20 rounded-xl p-4 text-center border border-pink-500/20">
                      <p className="text-3xl font-bold text-white">
                        {tokenBalance ? Number(formatEther(tokenBalance as bigint)).toFixed(2) : "0"}
                      </p>
                      <p className="text-sm text-gray-400">MJT Token</p>
                    </div>
                  </div>

                  {/* Approve Section */}
                  {!isApproved && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="flex-1">
                          <p className="text-yellow-300 font-medium mb-2">
                            Marketplace'ga ruxsat berilmagan
                          </p>
                          <p className="text-yellow-200/70 text-sm mb-4">
                            NFT sotish uchun avval marketplace kontraktiga ruxsat berishingiz kerak
                          </p>
                          <button
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition-all"
                          >
                            {isApproving ? "⏳ Kutilmoqda..." : "✅ Ruxsat berish"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* List NFT Form */}
                  {isApproved && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">📤 NFT sotuvga qo'yish</h3>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Token ID
                        </label>
                        <input
                          type="number"
                          value={listTokenId}
                          onChange={(e) => setListTokenId(e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Narx (ETH)
                        </label>
                        <input
                          type="text"
                          value={listPrice}
                          onChange={(e) => setListPrice(e.target.value)}
                          placeholder="0.01"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={handleList}
                        disabled={!listTokenId || !listPrice || isListing}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
                      >
                        {isListing ? "⏳ Joylashtirilmoqda..." : "📤 Sotuvga qo'yish"}
                      </button>

                      {listSuccess && (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center">
                          <span className="text-green-400">✅ NFT sotuvga qo'yildi!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-400">
              Built with ❤️ by <span className="text-purple-400 font-semibold">{OWNER_INFO.name}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Ethereum Blockchain | ERC-20 & ERC-721 | NFT Marketplace
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
