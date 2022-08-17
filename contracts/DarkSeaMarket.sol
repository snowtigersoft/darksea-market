// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./DarkSeaMarketTypes.sol";
import "./DarkForestTypes.sol";
import "./DarkSeaMarketStorage.sol";
import "./DarkSeaMarketList.sol";
import "./DarkSeaMarketOffer.sol";


contract DarkSeaMarket is Initializable, DarkSeaMarketStorage  {
    event Bought(address indexed token, uint256 listId);
    event Listed(address indexed token, uint256 listId);
    event Unlisted(address indexed token, uint256 listId);
    event PlacedOffer(address indexed token, uint256 offerId);
    event CancelOffer(address indexed token, uint256 offerId);
    event FillOffer(address indexed token, uint256 offerId);
    event FeeChanged(uint256 fee);
    event TransferFeeChanged(uint256 transferFee);
    event AddCollection(address indexed token, address owner, uint256 fee, uint256 minPrice);
    event EditCollection(address indexed token, address owner, uint256 fee, uint256 minPrice);
    event CollectionOwnerChanged(address indexed token, address owner);
    event CollectionFeeChanged(address indexed token, uint fee);
    event MinPriceChanged(address indexed token, uint256 minPrice);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Withdraw(address indexed owner, uint256 amount);

    function initialize(uint256 fee, uint256 transferFee, address owner) public initializer {
        s.paused = false;
        s.fee = fee;
        s.transferFee = transferFee;
        s.owner = owner;
    }

    modifier onlyOwner() {
        require(getOwner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    modifier tokenExists(address token) {
        require(s.collections[token].idx > 0, "Collection not exists");
        _;
    }

    modifier tokenNotExists(address token) {
        require(s.collections[token].idx == 0, "Collection exists");
        _;
    }

    modifier notPaused(address token) {
        require(!s.paused, "Market is already paused");
        require(!s.collections[token].paused, "Collection is already paused");
        _;
    }

    modifier isApproved(address token, uint256 tokenID) {
        Tokens t = s.collections[token].token;
        require(t.getApproved(tokenID) == address(this) || t.isApprovedForAll(t.ownerOf(tokenID), address(this)), "Approve require");
        _;
    }

    modifier onlyCollectionOwner(address token) {
        require(s.collections[token].owner == msg.sender, "Not the owner of collection");
        _;
    }

    function getOwner() public view returns (address) {
        return s.owner;
    }

    function getCollectionOwner(address token) public view returns (address) {
        return s.collections[token].owner;
    }

    function isInMarket(address token) external view returns (bool) {
        return s.collections[token].idx > 0;
    }

    // list
    function list(address token, address buyer, uint256 tokenID, uint256 price) external tokenExists(token) notPaused(token) isApproved(token, tokenID) {
        uint256 listId = DarkSeaMarketList.list(token, buyer, tokenID, price);
        emit Listed(token, listId);
    }

    function buy(address token, uint256 listId) public payable tokenExists(token) notPaused(token) {
        DarkSeaMarketTypes.Item memory item = s.collections[token].listings[listId];
        require (msg.value == item.price, "wrong value");
        DarkSeaMarketList.buy(token, listId);
        emit Bought(token, listId);
    }

    function unlist (address token, uint256 listId) public tokenExists(token) {
        DarkSeaMarketList.unlist(token, listId);
        emit Unlisted(token, listId);
    }

    function getItem(address token, uint256 listId) public view tokenExists(token) returns (DarkSeaMarketTypes.Item memory item) {
        item = DarkSeaMarketList.getItem(token, listId);
    }

    function bulkGetItems(address token, uint256 startIdx, uint256 endIdx) public view tokenExists(token) returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = DarkSeaMarketList.bulkGetItems(token, startIdx, endIdx);
    }

    function getAllItems(address token) public view tokenExists(token) returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = bulkGetItems(token, 0, s.collections[token].listedIds.length);
    }

    function getItemPage(address token, uint256 pageIdx, uint256 pageSize) public view tokenExists(token) returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = DarkSeaMarketList.getItemPage(token, pageIdx, pageSize);
    }

    function getNItemsByOwner(address token, address owner) public view tokenExists(token) returns (uint256) {
        return DarkSeaMarketList.getNItemsByOwner(token, owner);
    }

    function getItemsByOwner(address token, address owner) public view tokenExists(token) returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = DarkSeaMarketList.getItemsByOwner(token, owner);
    }

    function getNMyItems(address token) public view tokenExists(token) returns (uint256) {
        return getNItemsByOwner(token, msg.sender);
    }

    function getMyItems(address token) public view tokenExists(token) returns (DarkSeaMarketTypes.Item[] memory) {
        return getItemsByOwner(token, msg.sender);
    }

    // offer
    function placeOffer(address token, uint256 price, uint256 qty, DarkForestTypes.ArtifactRarity rarity, DarkForestTypes.ArtifactType artifactType) external payable tokenExists(token) notPaused(token) {
        require(msg.value == price * qty, "Price too low");
        uint256 offerId = DarkSeaMarketOffer.placeOffer(token, price, qty, rarity, artifactType);
        emit PlacedOffer(token, offerId);
    }

    function cancelOffer (address token, uint256 offerId) external tokenExists(token) {
        DarkSeaMarketOffer.cancelOffer(token, offerId);
        emit CancelOffer(token, offerId);
    }

    function fillOffer (address token, uint256 offerId, uint256 tokenID) external tokenExists(token) isApproved(token, tokenID) {
        DarkSeaMarketOffer.fillOffer(token, offerId, tokenID);
        emit FillOffer(token, offerId);
    }

    function getOffer(address token, uint256 offerId) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer memory ret) {
        ret = DarkSeaMarketOffer.getOffer(token, offerId);
    }

    function bulkGetOffers(address token, uint256 startIdx, uint256 endIdx) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer[] memory ret) {
        ret = DarkSeaMarketOffer.bulkGetOffers(token, startIdx, endIdx);
    }

    function getAllOffers(address token) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer[] memory) {
        return bulkGetOffers(token, 0, s.collections[token].offerIds.length);
    }

    function getOfferPage(address token, uint256 pageIdx, uint256 pageSize) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer[] memory ret) {
        ret = DarkSeaMarketOffer.getOfferPage(token, pageIdx, pageSize);
    }

    function getNOffersByBuyer(address token, address buyer) public view tokenExists(token) returns (uint256) {
        return DarkSeaMarketOffer.getNOffersByBuyer(token, buyer);
    }

    function getOffersByBuyer(address token, address buyer) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer[] memory ret) {
        ret = DarkSeaMarketOffer.getOffersByBuyer(token, buyer);
    }

    function getNMyOffers(address token) public view tokenExists(token) returns (uint256) {
        return getNOffersByBuyer(token, msg.sender);
    }

    function getMyOffers(address token) public view tokenExists(token) returns (DarkSeaMarketTypes.Offer[] memory) {
        return getOffersByBuyer(token, msg.sender);
    }

    //
    function withdraw() external {
        uint256 amount = s.funds[msg.sender];
        if (amount > 0) {
            s.funds[msg.sender] = 0;
            AddressUpgradeable.sendValue(payable(msg.sender), amount);
            emit Withdraw(msg.sender, amount);
        }
    }

    function getCollectionFee(address token) public view tokenExists(token) returns (uint256 fee) {
        fee = s.collections[token].fee;
    }

    function getCollectionMinPrice(address token) public view tokenExists(token) returns (uint256){
        return s.collections[token].minPrice;
    }

    // add/edit collection
    function _addCollection(address token, address owner, uint256 fee, uint256 minPrice) internal {
        require(fee <= 2000, "don't be greater than 20%!");
        s.collections[token].token = Tokens(token);
        s.collections[token].idx = s.collectionIds.length + 1;
        s.collections[token].owner = owner;
        s.collections[token].fee = fee;
        s.collections[token].minPrice = minPrice;
        s.collections[token].paused = false;
        s.collectionIds.push(token);
        emit AddCollection(token, owner, fee, minPrice);
    }

    function _editCollection(address token, address owner, uint256 fee, uint256 minPrice) internal {
        require(fee <= 2000, "don't be greater than 20%!");
        s.collections[token].owner = owner;
        s.collections[token].fee = fee;
        s.collections[token].minPrice = minPrice;
        emit EditCollection(token, owner, fee, minPrice);
    }

    // collection owner functions
    function addByOwner(address token, uint256 fee, uint256 minPrice) external tokenNotExists(token) {
        require(minPrice >= 0.01 ether, "Min Price must greater than 0.01");
        Tokens t = Tokens(token);
        require(t.adminAddress() == msg.sender, "Not admin of the token");
        _addCollection(token, msg.sender, fee, minPrice);
    }

    function editByOwner(address token, uint256 fee, uint256 minPrice) external tokenExists(token) onlyCollectionOwner(token) {
        require(minPrice >= 0.01 ether, "Min Price must greater than 0.01");
        _editCollection(token, msg.sender, fee, minPrice);
    }

    function collectCollectionFees(address token) external tokenExists(token) onlyCollectionOwner(token) {
        require (s.collections[token].feeBalance > 0, "No fee left");
        uint256 amount = s.collections[token].feeBalance;
        s.collections[token].feeBalance = 0;
        AddressUpgradeable.sendValue(payable(msg.sender), amount);
    }

    function transferCollectionOwner(address token, address newOwner) external tokenExists(token) onlyCollectionOwner(token) {
        s.collections[token].owner = newOwner;
        emit CollectionOwnerChanged(token, newOwner);
    }

    function getCollectionFeeBalance(address token) external view tokenExists(token) onlyCollectionOwner(token) returns (uint256) {
        return s.collections[token].feeBalance;
    }

    function getCollectionTotalFee(address token) external view tokenExists(token) onlyCollectionOwner(token) returns (uint256) {
        return s.collections[token].totalFee;
    }
    
    // ADMIN FUNCTIONS
    
    // Add new collection to market
    function addCollection(address token, address owner, uint256 fee, uint256 minPrice) external onlyOwner tokenNotExists(token) {
        _addCollection(token, owner, fee, minPrice);
    }

    function editCollection(address token, address owner, uint256 fee, uint256 minPrice) external onlyOwner tokenExists(token) {
        _editCollection(token, owner, fee, minPrice);
    }

    // Collect fees
    function sendFees(address to, uint256 amount) public onlyOwner {
        require (s.feeBalance >= amount, "Not enough fee left");
        s.feeBalance -= amount;
        AddressUpgradeable.sendValue(payable(to), amount);
    }

    function collectFees() external onlyOwner {
        sendFees(getOwner(), s.feeBalance);
    }
    
    // change the fee
    function setFee(uint256 fee) external onlyOwner {
        require(fee <= 2000, "don't be greater than 20%!");
        s.fee = fee;
        emit FeeChanged(s.fee);
    }

    function getTotalFee() external view onlyOwner returns (uint256) {
        return s.totalFee;
    }

    function getFeeBalance() external view onlyOwner returns (uint256) {
        return s.feeBalance;
    }

    function setTransferFee(uint256 transferFee) external onlyOwner {
        s.transferFee = transferFee;
        emit TransferFeeChanged(s.transferFee);
    }

    function setMinPrice(address token, uint256 minPrice) external onlyOwner tokenExists(token) {
        s.collections[token].minPrice = minPrice;
        emit MinPriceChanged(token, s.collections[token].minPrice);
    }
    
    function pause(address token) external onlyOwner tokenExists(token) {
        s.collections[token].paused = true;
    }

    function pauseMarket() external onlyOwner {
        s.paused = true;
    }
    
    function unpause(address token) external onlyOwner tokenExists(token) {
        require(s.collections[token].paused, "Collection is already unpaused");
        s.collections[token].paused = false;
    }

    function unpauseMarket() external onlyOwner {
        require(s.paused, "Market is already unpaused");
        s.paused = false;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = s.owner;
        s.owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}