// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DarkForestTypes.sol";
import "./Tokens.sol";

library DarkSeaMarketTypes {
    enum Status {
        LISTED,
        UNLISTED,
        SOLD
    }

    struct Item {
        uint256 listId;
        uint256 tokenID;
        address owner; // who owns the listed item
        address buyer;
        uint256 price;
        uint256 payout;  // price - price * (fee + collection_fee) / 100 or price - transferPrice
        uint256 baseFee;
        Status status;
    }

    struct Offer {
        uint256 offerId;
        uint256 qty;
        uint256 deal;
        address buyer;
        uint256 price;
        uint256 tokenID;
        DarkForestTypes.ArtifactRarity rarity;
        DarkForestTypes.ArtifactType artifactType;
        Status status;
    }

    struct Collection {
        uint256 fee;
        address owner;
        uint256 feeBalance;
        uint256 totalFee;
        uint256 traded;
        uint256 idx;
        uint256 minPrice;
        uint256 listingCount;
        uint256 offerCount;
        Tokens token;
        bool paused;
        mapping(uint256 => Item) listings; // all listings
        uint256[] listedIds;
        mapping(uint256 => Offer) offers; // all offers
        uint256[] offerIds;
    }

    struct Storage {
        uint256 fee;
        uint256 transferFee;
        uint256 feeBalance;
        uint256 totalFee;
        uint256 nextListId;
        bool paused; // pause the whole market
        mapping(address => Collection) collections;
        address[] collectionIds;
        mapping(address => uint256) funds;
        address owner;
    }
}