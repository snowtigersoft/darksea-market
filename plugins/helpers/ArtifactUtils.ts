import bigInt from 'big-integer';
import {
    ArtifactId,
    ArtifactType,
    Biome,
    ArtifactRarity,
    Artifact,
    ArtifactTypeNames,
    ArtifactRarityNames,
    BiomeNames,
    Upgrade,
} from '@darkforest_eth/types';

export function hashToInt(hash: string): number {
    const seed = bigInt(hash, 16).and(0xffffffffff).toString(16);
    return parseInt('0x' + seed);
}

export function artifactRoll(id: ArtifactId): number {
    return hashToInt(id) % 256;
}

const artifactIsAncientMap: Map<ArtifactId, boolean> = new Map();

export interface RenderedArtifact extends Partial<Artifact> {
    artifactType: ArtifactType;
    planetBiome: Biome;
    rarity: ArtifactRarity;
    id: ArtifactId; // for rolls
}

export function isAncient(artifact: RenderedArtifact): boolean {
    const { id, planetBiome: biome } = artifact;

    if (artifactIsAncientMap.has(id)) {
        return artifactIsAncientMap.get(id) || false;
    }

    let ancient = false;
    const roll = artifactRoll(id);

    if (biome === Biome.CORRUPTED) ancient = roll % 2 === 0;
    else ancient = roll % 16 === 0;

    artifactIsAncientMap.set(id, ancient);

    return ancient;
}

export function artifactFileName(
    videoMode: boolean,
    thumb: boolean,
    artifact: Artifact,
): string {
    const { artifactType: type, rarity, planetBiome: biome, id } = artifact;
    const size = thumb ? '16' : '64';
    const ext = videoMode ? 'webm' : 'png';

    const typeStr = ArtifactTypeNames[type];
    const rarityStr = ArtifactRarityNames[rarity];
    let nameStr = "";
    if (isAncient(artifact)) {
        nameStr = 'ancient';
    } else {
        nameStr = biome + BiomeNames[biome];
    }
    const fileName = `${typeStr}-${rarityStr}-${nameStr}`;

    return `${size}-${fileName}.${ext}`;
}
