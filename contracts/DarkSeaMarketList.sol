// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DarkSeaMarketTypes.sol";

library DarkSeaMarketList {
    function s() public pure returns (DarkSeaMarketTypes.Storage storage ret) {
        bytes32 position = bytes32(uint256(1));
        assembly {
            ret.slot := position
        }
    }

    function list(address token, address buyer, uint256 tokenID, uint256 price) public returns(uint256) {
        uint256 baseFee = (price * s().fee) / 10000;
        uint256 payout = price - baseFee - ((price * s().collections[token].fee) / 10000);
        if (buyer == address(0)) {
            require(price >= s().collections[token].minPrice, "Price too low");
        } else {
            baseFee = s().transferFee;
            payout = price - baseFee;
            require(payout >= 0, "Price too low");
        }

        uint256 listId = s().nextListId;
        s().nextListId++;

        s().collections[token].listings[listId] = DarkSeaMarketTypes.Item({
            listId: listId,
            tokenID: tokenID,
            owner: msg.sender,
            buyer: buyer,
            price: price,
            baseFee: baseFee,
            payout: payout,
            status: DarkSeaMarketTypes.Status.LISTED
        });

        s().collections[token].listedIds.push(listId);
        s().collections[token].listingCount++;

        s().collections[token].token.transferFrom(msg.sender, address(this), tokenID);
        return listId;
    }

    // buying function. User input is the price include fee
    function buy(address token, uint256 listId) public {
        DarkSeaMarketTypes.Item memory item = s().collections[token].listings[listId];

        require (item.status == DarkSeaMarketTypes.Status.LISTED, "item not listed");

        if (item.buyer != address(0)) {
            require (item.buyer == msg.sender, "Wrong sender");
        }

        item.status = DarkSeaMarketTypes.Status.SOLD;
        item.buyer = msg.sender;

        s().collections[token].listings[listId] = item;
        s().funds[item.owner] += item.payout;
        s().collections[token].listingCount--;
        s().feeBalance += item.baseFee;
        s().totalFee += item.baseFee;
        s().collections[token].feeBalance += item.price - item.baseFee - item.payout;
        s().collections[token].totalFee += item.price - item.baseFee - item.payout;

        s().collections[token].token.transferFrom(address(this), msg.sender, item.tokenID);
    }

    // Unlist a token you listed
    // Useful if you want your tokens back
    function unlist (address token, uint256 listId) public {
        DarkSeaMarketTypes.Item memory item = s().collections[token].listings[listId];
        require(msg.sender == item.owner);
        require(item.status == DarkSeaMarketTypes.Status.LISTED, "item not listed");

        item.status = DarkSeaMarketTypes.Status.UNLISTED;

        s().collections[token].listings[listId] = item;
        s().collections[token].listingCount--;

        s().collections[token].token.transferFrom(address(this), item.owner, item.tokenID);
    }

    // listing items area
    function getItem(address token, uint256 listId) public view returns (DarkSeaMarketTypes.Item memory) {
        DarkSeaMarketTypes.Item memory item = s().collections[token].listings[listId];
        require(item.owner != address(0), "No item for that id");
        return item;
    }

    function bulkGetItems(address token, uint256 startIdx, uint256 endIdx) public view returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = new DarkSeaMarketTypes.Item[](endIdx - startIdx);
        for (uint256 idx = startIdx; idx < endIdx; idx++) {
            ret[idx - startIdx] = getItem(token, s().collections[token].listedIds[idx]);
        }
    }

    function getItemPage(address token, uint256 pageIdx, uint256 pageSize) public view returns (DarkSeaMarketTypes.Item[] memory) {
        uint256 startIdx = pageIdx * pageSize;
        require(startIdx <= s().collections[token].listedIds.length, "Page number too high");
        uint256 pageEnd = startIdx + pageSize;
        uint256 endIdx = pageEnd <= s().collections[token].listedIds.length ? pageEnd : s().collections[token].listedIds.length;
        return bulkGetItems(token, startIdx, endIdx);
    }

    function getNItemsByOwner(address token, address owner) public view returns (uint256) {
        uint256 cnt = 0;
        DarkSeaMarketTypes.Item memory item;
        for (uint256 idx = 0; idx < s().collections[token].listedIds.length; idx++) {
            item = getItem(token, s().collections[token].listedIds[idx]);
            if (item.owner == owner && item.status == DarkSeaMarketTypes.Status.LISTED) {
                cnt++;
            }
        }
        return cnt;
    }

    function getItemsByOwner(address token, address owner) public view returns (DarkSeaMarketTypes.Item[] memory ret) {
        ret = new DarkSeaMarketTypes.Item[](getNItemsByOwner(token, owner));
        uint256 pos = 0;
        DarkSeaMarketTypes.Item memory item;
        for (uint256 idx = 0; idx < s().collections[token].listedIds.length; idx++) {
            item = getItem(token, s().collections[token].listedIds[idx]);
            if (item.owner == owner && item.status == DarkSeaMarketTypes.Status.LISTED) {
                ret[pos] = item;
                pos++;
            }
        }
    }
    // end
}