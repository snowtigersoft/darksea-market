// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface DarkForestTokens {
    function transferFrom(address from, address to, uint256 tokenID) external;
}

contract DarkSeaMarket is Ownable {
    event Bought(uint256 blockNumber);
    event Listed(uint256 blockNumber);
    event Unlisted(uint256 blockNumber);
    event FeeChanged(uint256 fee);
    event MinPriceChanged(uint256 minPrice);
    event TransferFeeChanged(uint256 transferFee);

    enum Status {
        LISTED, 
        UNLISTED, 
        SOLD
    }
  
    struct Item {
        uint256 listId;
        uint256 tokenID;
        address owner; // who owns the listed artifact
        address buyer;
        uint128 artifactType;
        uint128 rarity;
        uint256 price;
        uint256 payout;  // price - price * fee / 100 or price - transferPrice
        Status status;
    }

    struct Storage {
        uint256 fee;
        uint256 minPrice;
        uint256 transferFee;
        uint256 feeBalance;
        uint256 listingCount;
        bool paused;
        mapping(uint256 => Item) listings; // all listings 
        uint256[] listedIds;
        mapping(address => uint256) funds;
    }
    
    DarkForestTokens private DFTokens; 
    Storage private s;

    constructor(address tokensAddress, uint8 fee, uint256 minPrice, uint256 transferFee) {
        DFTokens = DarkForestTokens(tokensAddress);  
        s.paused = false;
        s.fee = fee;
        s.minPrice = minPrice;
        s.transferFee = transferFee;
    }

    function list(address buyer, uint256 tokenID, uint8 artifactType, uint8 rarity, uint256 price) external  {
        require(!s.paused, "Market is already paused");

        uint256 payout = price - ((price * s.fee) / 100);
        if (buyer == address(0)) {
            require(price >= s.minPrice, "Price too low");
        } else {
            payout = price - s.transferFee;
            require(payout >= 0, "Price too low");
        }

        uint256 listId =
            uint256(
                keccak256(
                    abi.encodePacked(
                        tokenID,
                        msg.sender,
                        price,
                        block.timestamp,
                        block.difficulty
                    )
                )
            );
        
        s.listings[listId] = Item({
            listId: listId,
            tokenID: tokenID,
            owner: msg.sender,
            buyer: buyer,
            artifactType: artifactType,
            rarity: rarity,
            price: price,
            payout: payout,
            status: Status.LISTED
        });

        s.listedIds.push(listId);
        s.listingCount++;

        DFTokens.transferFrom(msg.sender, address(this), tokenID);
        emit Listed(listId);
    }

    // buying function. User input is the price include fee
    function buy(uint256 listId) external payable  {
        require(!s.paused, "Market is already paused");
        
        Item memory item = s.listings[listId];

        require (msg.value == item.price, "wrong value");
        require (item.status == Status.LISTED, "artifact not listed");

        if (item.buyer != address(0)) {
            require (item.buyer == msg.sender, "Wrong sender");
        }

        item.status = Status.SOLD;
        item.buyer = msg.sender;

        s.listings[listId] = item;
        s.funds[item.owner] += item.payout;
        s.listingCount--;
        s.feeBalance += item.price - item.payout;

        DFTokens.transferFrom(address(this), msg.sender, item.tokenID);

        emit Bought(listId);
    }

    function withdraw() external {
        uint256 amount = s.funds[msg.sender];
        if (amount > 0) {
            s.funds[msg.sender] = 0;
            Address.sendValue(payable(msg.sender), amount);
        }
    }

    function getBalanceByAddress(address addr) public view returns (uint256) {
        return s.funds[addr];
    }

    function getMyBalance() public view returns (uint256) {
        return s.funds[msg.sender];
    }
    
    // Unlist a token you listed
    // Useful if you want your tokens back
    function unlist (uint256 listId) external {
        Item memory item = s.listings[listId];
        require(msg.sender == item.owner);

        item.status = Status.UNLISTED;

        s.listings[listId] = item;
        s.listingCount--;
        
        DFTokens.transferFrom(address(this), item.owner, item.tokenID);
        emit Unlisted(listId);
    }

    function getNListedArtifacts() public view returns (uint256) {
        return s.listedIds.length;
    }

    function getArtifact(uint256 listId) public view returns (Item memory) {
        Item memory token = s.listings[listId];
        require(token.owner != address(0), "No artifact for that id");
        return token;
    }

    function bulkGetArtifacts(uint256 startIdx, uint256 endIdx) public view returns (Item[] memory ret) {
        ret = new Item[](endIdx - startIdx);
        for (uint256 idx = startIdx; idx < endIdx; idx++) {
            ret[idx - startIdx] = getArtifact(s.listedIds[idx]);
        }
    }

    function getAllArtifacts() public view returns (Item[] memory) {
        return bulkGetArtifacts(0, s.listedIds.length);
    }

    function getArtifactPage(uint256 pageIdx, uint256 pageSize) public view returns (Item[] memory) {
        uint256 startIdx = pageIdx * pageSize;
        require(startIdx <= s.listedIds.length, "Page number too high");
        uint256 pageEnd = startIdx + pageSize;
        uint256 endIdx = pageEnd <= s.listedIds.length ? pageEnd : s.listedIds.length;
        return bulkGetArtifacts(startIdx, endIdx);
    }

    function getNArtifactsByOwner(address owner) public view returns (uint256) {
        uint256 cnt = 0;
        for (uint256 idx = 0; idx < s.listedIds.length; idx++) {
            if (getArtifact(s.listedIds[idx]).owner == owner) {
                cnt++;
            }
        }
        return cnt;
    }

    function getArtifactsByOwner(address owner) public view returns (Item[] memory ret) {
        ret = new Item[](getNArtifactsByOwner(owner));
        uint256 pos = 0;
        Item memory item;
        for (uint256 idx = 0; idx < s.listedIds.length; idx++) {
            item = getArtifact(s.listedIds[idx]);
            if (item.owner == owner) {
                ret[pos] = item;
                pos++;
            }
        }
    }

    function getNMyArtifacts() public view returns (uint256) {
        return getNArtifactsByOwner(msg.sender);
    }

    function getMyArtifacts() public view returns (Item[] memory) {
        return getArtifactsByOwner(msg.sender);
    }

    function getFee() public view returns (uint256) {
        return s.fee;
    }

    function getTransferFee() public view returns (uint256) {
        return s.transferFee;
    }

    function getMinPrice() public view returns (uint256){
        return s.minPrice;
    }
    
    // ADMIN FUNCTIONS
    
    // Change the tokens address between rounds
    function newRound(address tokens) external onlyOwner {
        DFTokens = DarkForestTokens(tokens);
    }

    // Collect fees between rounds
    function collectFees() external onlyOwner {
        require (s.feeBalance > 0, "No fee left");
        Address.sendValue(payable(owner()), s.feeBalance);
    }
    
    // change the fee
    function setFee(uint256 fee) external onlyOwner {
        require(fee <= 20, "don't be greater than 20%!");
        s.fee = fee;
        emit FeeChanged(s.fee);
    }

    function setTransferFee(uint256 transferFee) external onlyOwner {
        s.transferFee = transferFee;
        emit TransferFeeChanged(s.transferFee);
    }

    function setMinPrice(uint256 minPrice) external onlyOwner {
        s.minPrice = minPrice;
        emit MinPriceChanged(s.minPrice);
    }
    
    function pause() external onlyOwner {
        s.paused = true;
    }
    
    function unpause() external onlyOwner {
        require(s.paused, "Market is already unpaused");
        s.paused = false;
    }
}