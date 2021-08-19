import { ArtifactRarity } from "@darkforest_eth/types";

export const listStyle = {
    maxHeight: '400px',
    overflowX: 'hidden',
    overflowY: 'scroll',
};

export const RarityColors = {
    [ArtifactRarity.Unknown]: '#000000',
    [ArtifactRarity.Common]: 'rgb(131, 131, 131)',
    [ArtifactRarity.Rare]: '#6b68ff',
    [ArtifactRarity.Epic]: '#c13cff',
    [ArtifactRarity.Legendary]: '#f8b73e',
    [ArtifactRarity.Mythic]: '#ff44b7',
}
