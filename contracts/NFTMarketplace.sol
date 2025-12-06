// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTMarketplace - NFT sotish va sotib olish platformasi
 * @author Nosirov Mamurjon
 * @notice Bu NFT Marketplace kontrakti
 */
contract NFTMarketplace is IERC721Receiver, ReentrancyGuard, Ownable {
    
    // Listing strukturasi
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool isActive;
    }

    // Listinglar
    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;

    // Platform komissiyasi (2.5% = 250 / 10000)
    uint256 public platformFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Events
    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event ItemCanceled(uint256 indexed listingId);
    event PriceUpdated(uint256 indexed listingId, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice NFT ni sotuvga qo'yish
     * @param nftContract NFT kontrakt manzili
     * @param tokenId NFT token ID
     * @param price Narxi (wei da)
     */
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Narx 0 dan katta bo'lishi kerak");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Siz bu NFT egasi emassiz");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) ||
            nft.getApproved(tokenId) == address(this),
            "Marketplace ga ruxsat berilmagan"
        );

        // NFT ni marketplace ga o'tkazish
        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        uint256 listingId = listingCount;
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            isActive: true
        });
        
        listingCount++;

        emit ItemListed(listingId, msg.sender, nftContract, tokenId, price);
        
        return listingId;
    }

    /**
     * @notice NFT sotib olish
     * @param listingId Listing ID
     */
    function buyItem(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Bu listing faol emas");
        require(msg.value >= listing.price, "Yetarli mablag' yubormadingiz");
        require(msg.sender != listing.seller, "O'z NFT ingizni sotib ololmaysiz");

        listing.isActive = false;

        // Komissiyani hisoblash
        uint256 fee = (listing.price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;

        // Sotuvchiga to'lov
        payable(listing.seller).transfer(sellerAmount);

        // NFT ni xaridorga o'tkazish
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        // Ortiqcha mablag'ni qaytarish
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit ItemSold(listingId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @notice Listing ni bekor qilish
     * @param listingId Listing ID
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Bu listing faol emas");
        require(listing.seller == msg.sender, "Faqat sotuvchi bekor qila oladi");

        listing.isActive = false;

        // NFT ni egasiga qaytarish
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        emit ItemCanceled(listingId);
    }

    /**
     * @notice Narxni yangilash
     * @param listingId Listing ID
     * @param newPrice Yangi narx
     */
    function updatePrice(uint256 listingId, uint256 newPrice) external {
        Listing storage listing = listings[listingId];
        
        require(listing.isActive, "Bu listing faol emas");
        require(listing.seller == msg.sender, "Faqat sotuvchi narxni o'zgartira oladi");
        require(newPrice > 0, "Narx 0 dan katta bo'lishi kerak");

        listing.price = newPrice;

        emit PriceUpdated(listingId, newPrice);
    }

    /**
     * @notice Barcha faol listinglarni olish
     */
    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < listingCount; i++) {
            if (listings[i].isActive) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < listingCount; i++) {
            if (listings[i].isActive) {
                activeListings[currentIndex] = listings[i];
                currentIndex++;
            }
        }

        return activeListings;
    }

    /**
     * @notice Bitta listing ma'lumotini olish
     * @param listingId Listing ID
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    /**
     * @notice Platform komissiyasini o'zgartirish (faqat owner)
     * @param newFee Yangi komissiya (10000 = 100%)
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Maksimal komissiya 10%");
        platformFee = newFee;
    }

    /**
     * @notice Yig'ilgan komissiyani yechib olish
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balans bo'sh");
        payable(owner()).transfer(balance);
    }

    /**
     * @notice ERC721Receiver implementation
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
