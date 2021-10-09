import {
    Artifact,
    ArtifactRarity,
    ArtifactRarityNames,
    ArtifactTypeNames,
} from '@darkforest_eth/types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { RarityColors } from '../../helpers/styles';
import { LegendaryLabel, LegendaryLabelText } from './LegendaryLabel';
import { MythicLabel, MythicLabelText } from './MythicLabel';
// raw text

const ArtifactTypeTextRaw = ({ artifact, isOffer}: { artifact: Artifact, isOffer: boolean}) => (
    isOffer ? ArtifactTypeNames[artifact.artifactType].replace("Unknown", "Any Type") : ArtifactTypeNames[artifact.artifactType]
);

export const ArtifactRarityText = ({ artifact }: { artifact: Artifact }) => (
    <>{ArtifactRarityNames[artifact.rarity]}</>
);

export const ArtifactTypeText = ({ artifact, isOffer}: { artifact: Artifact, isOffer: boolean}) => (
    <>{ArtifactTypeTextRaw({artifact, isOffer})}</>
);

// colored labels

export const StyledArtifactRarityLabel = styled.span<{ rarity: ArtifactRarity }>`
    color: ${({ rarity }) => RarityColors[rarity]};
  `;

export const ArtifactRarityLabel = ({ artifact }: { artifact: Artifact }) => (
    <StyledArtifactRarityLabel rarity={artifact.rarity}>
        <ArtifactRarityText artifact={artifact} />
    </StyledArtifactRarityLabel>
);

export const ArtifactRarityLabelAnim = ({ artifact }: { artifact: Artifact }) =>
    artifact.rarity === ArtifactRarity.Mythic ? (
        <MythicLabel />
    ) : artifact.rarity === ArtifactRarity.Legendary ? (
        <LegendaryLabel />
    ) : (
        <ArtifactRarityLabel artifact={artifact} />
    );

// combined labels

export const ArtifactRarityTypeLabelAnim = ({ artifact, isOffer }: { artifact: Artifact, isOffer: boolean}) =>
    artifact.rarity === ArtifactRarity.Mythic ? (
        <MythicLabelText text={ArtifactTypeTextRaw({artifact, isOffer})} />
    ) : artifact.rarity === ArtifactRarity.Legendary ? (
        <LegendaryLabelText text={ArtifactTypeTextRaw({artifact, isOffer})} />
    ) : (
        <StyledArtifactRarityLabel rarity={artifact.rarity}>
            <ArtifactTypeText artifact={artifact} isOffer={isOffer} />
        </StyledArtifactRarityLabel>
    );