// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DarkSeaMarketTypes.sol";

contract DarkSeaMarketStorage {
    DarkSeaMarketTypes.Storage internal s;

    function getFee() public view returns (uint256) {
        return s.fee;
    }

    function getTransferFee() public view returns (uint256) {
        return s.transferFee;
    }

    function getAllCollections() public view returns (address[] memory) {
        return s.collectionIds;
    }

    function getListingCount(address token) public view returns (uint256) {
        return s.collections[token].listingCount;
    }

    function getOfferCount(address token) public view returns (uint256) {
        return s.collections[token].offerCount;
    }

    function getBalanceByAddress(address addr) public view returns (uint256) {
        return s.funds[addr];
    }

    function getMyBalance() public view returns (uint256) {
        return s.funds[msg.sender];
    }
}