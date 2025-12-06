// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyNFT - ERC-721 NFT Collection
 * @author Nosirov Mamurjon
 * @notice Bu NFT kolleksiya kontrakti
 */
contract MyNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    
    uint256 private _tokenIdCounter;
    uint256 public mintPrice = 0.001 ether;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    /**
     * @notice NFT mint qilish (pullik)
     * @param to NFT oladigan manzil
     * @param uri Metadata URI (IPFS yoki HTTP)
     */
    function mint(address to, string memory uri) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Yetarli mablag' yubormadingiz");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }

    /**
     * @notice Bepul NFT mint qilish (faqat owner)
     * @param to NFT oladigan manzil
     * @param uri Metadata URI
     */
    function freeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }

    /**
     * @notice Mint narxini o'zgartirish
     * @param newPrice Yangi narx (wei da)
     */
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }

    /**
     * @notice Kontraktdagi ETH ni yechib olish
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balans bo'sh");
        payable(owner()).transfer(balance);
    }

    /**
     * @notice Joriy token ID ni olish
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Override functions for multiple inheritance
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
