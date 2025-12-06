// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken - ERC-20 Token
 * @author Nosirov Mamurjon
 * @notice Bu oddiy ERC-20 token kontrakti
 */
contract MyToken is ERC20, Ownable {
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // Boshlang'ich tokenlarni owner'ga mint qilish
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @notice Yangi token mint qilish (faqat owner)
     * @param to Token oladigan manzil
     * @param amount Token miqdori
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Tokenlarni yoqish (burn)
     * @param amount Yoqiladigan token miqdori
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
