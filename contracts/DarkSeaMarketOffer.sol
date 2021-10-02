// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./DarkSeaMarketTypes.sol";

library DarkSeaMarketOffer {
    function s() public pure returns (DarkSeaMarketTypes.Storage storage ret) {
        bytes32 position = bytes32(uint256(1));
        assembly {
            ret.slot := position
        }
    }

    function placeOffer(address token, uint256 price, uint256 qty, DarkForestTypes.ArtifactRarity rarity, DarkForestTypes.ArtifactType artifactType) public returns(uint256) {
        require(qty > 0, "qty must gt 0");
        require(price > 0, "qty must gt 0");

        uint256 offerId = s().nextListId;
        s().nextListId++;

        s().collections[token].offers[offerId] = DarkSeaMarketTypes.Offer({
            offerId: offerId,
            qty: qty,
            deal: 0,
            buyer: msg.sender,
            price: price,
            tokenID: 0,
            rarity: rarity,
            artifactType: artifactType,
            status: DarkSeaMarketTypes.Status.LISTED
        });

        s().collections[token].offerIds.push(offerId);
        s().collections[token].offerCount++;
        return offerId;
    }

    function cancelOffer (address token, uint256 offerId) public {
        DarkSeaMarketTypes.Offer memory offer = s().collections[token].offers[offerId];
        require(msg.sender == offer.buyer);
        require(offer.status == DarkSeaMarketTypes.Status.LISTED, "offer status error");

        offer.status = DarkSeaMarketTypes.Status.UNLISTED;

        s().collections[token].offers[offerId] = offer;
        s().collections[token].offerCount--;

        uint256 amount = offer.price * (offer.qty - offer.deal);
        AddressUpgradeable.sendValue(payable(msg.sender), amount);
    }

    function fillOffer (address token, uint256 offerId, uint256 tokenID) public {
        DarkSeaMarketTypes.Offer memory offer = s().collections[token].offers[offerId];
        require(offer.status == DarkSeaMarketTypes.Status.LISTED, "offer status error");
        require(offer.qty > offer.deal, "offer filled");

        DarkForestTypes.Artifact memory artifact = s().collections[token].token.getArtifact(tokenID);
        require(artifact.rarity == offer.rarity, "Rarity not match");
        if (offer.artifactType != DarkForestTypes.ArtifactType.Unknown) {
            require(artifact.artifactType == offer.artifactType, "Artifact type not match");
        }

        offer.deal++;
        if (offer.qty == offer.deal) {
            offer.status = DarkSeaMarketTypes.Status.SOLD;
            s().collections[token].offerCount--;
        }

        s().collections[token].offers[offerId] = offer;

        uint256 baseFee = (offer.price * s().fee) / 10000;
        uint256 collectFee = (offer.price * s().collections[token].fee) / 10000;
        s().feeBalance += baseFee;
        s().totalFee += baseFee;
        s().collections[token].feeBalance += collectFee;
        s().collections[token].totalFee += collectFee;
        s().funds[msg.sender] += offer.price - baseFee - collectFee;

        s().collections[token].token.transferFrom(msg.sender, offer.buyer, tokenID);
    }

    // offers area
    function getOffer(address token, uint256 offerId) public view returns (DarkSeaMarketTypes.Offer memory) {
        DarkSeaMarketTypes.Offer memory offer = s().collections[token].offers[offerId];
        require(offer.buyer != address(0), "No offer for that id");
        return offer;
    }

    function bulkGetOffers(address token, uint256 startIdx, uint256 endIdx) public view returns (DarkSeaMarketTypes.Offer[] memory ret) {
        ret = new DarkSeaMarketTypes.Offer[](endIdx - startIdx);
        for (uint256 idx = startIdx; idx < endIdx; idx++) {
            ret[idx - startIdx] = getOffer(token, s().collections[token].offerIds[idx]);
        }
    }

    function getOfferPage(address token, uint256 pageIdx, uint256 pageSize) public view returns (DarkSeaMarketTypes.Offer[] memory) {
        uint256 startIdx = pageIdx * pageSize;
        require(startIdx <= s().collections[token].offerIds.length, "Page number too high");
        uint256 pageEnd = startIdx + pageSize;
        uint256 endIdx = pageEnd <= s().collections[token].offerIds.length ? pageEnd : s().collections[token].offerIds.length;
        return bulkGetOffers(token, startIdx, endIdx);
    }

    function getNOffersByBuyer(address token, address buyer) public view returns (uint256) {
        uint256 cnt = 0;
        DarkSeaMarketTypes.Offer memory offer;
        for (uint256 idx = 0; idx < s().collections[token].offerIds.length; idx++) {
            offer = getOffer(token, s().collections[token].offerIds[idx]);
            if (offer.buyer == buyer && offer.status == DarkSeaMarketTypes.Status.LISTED) {
                cnt++;
            }
        }
        return cnt;
    }

    function getOffersByBuyer(address token, address buyer) public view returns (DarkSeaMarketTypes.Offer[] memory ret) {
        ret = new DarkSeaMarketTypes.Offer[](getNOffersByBuyer(token, buyer));
        uint256 pos = 0;
        DarkSeaMarketTypes.Offer memory offer;
        for (uint256 idx = 0; idx < s().collections[token].offerIds.length; idx++) {
            offer = getOffer(token, s().collections[token].offerIds[idx]);
            if (offer.buyer == buyer && offer.status == DarkSeaMarketTypes.Status.LISTED) {
                ret[pos] = offer;
                pos++;
            }
        }
    }
    // end
}