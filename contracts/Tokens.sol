// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./DarkForestTypes.sol";

interface Tokens {
    function transferFrom(address from, address to, uint256 tokenID) external;
    function ownerOf(uint256 _tokenId) external view returns (address);
    function getApproved(uint256 _tokenId) external view returns (address);
    function isApprovedForAll(address _owner, address _operator) external view returns (bool);
    function getArtifact(uint256 tokenId) external view returns (DarkForestTypes.Artifact memory);
    function adminAddress() external view returns (address);
}
