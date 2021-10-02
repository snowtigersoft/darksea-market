// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library DarkForestTypes {
    enum Biome {
        Unknown,
        Ocean,
        Forest,
        Grassland,
        Tundra,
        Swamp,
        Desert,
        Ice,
        Wasteland,
        Lava,
        Corrupted
    }

    enum ArtifactType {
        Unknown,
        Monolith,
        Colossus,
        Spaceship,
        Pyramid,
        Wormhole,
        PlanetaryShield,
        PhotoidCannon,
        BloomFilter,
        BlackDomain
    }

    enum ArtifactRarity {Unknown, Common, Rare, Epic, Legendary, Mythic}

    // for NFTs
    struct Artifact {
        bool isInitialized;
        uint256 id;
        uint256 planetDiscoveredOn;
        ArtifactRarity rarity;
        Biome planetBiome;
        uint256 mintedAtTimestamp;
        address discoverer;
        ArtifactType artifactType;
        // an artifact is 'activated' iff lastActivated > lastDeactivated
        uint256 lastActivated;
        uint256 lastDeactivated;
        uint256 wormholeTo; // location id
    }
}