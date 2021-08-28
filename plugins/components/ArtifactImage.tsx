import { Artifact, ArtifactRarityNames, ArtifactTypeNames, BiomeNames } from '@darkforest_eth/types';
import React from 'react';
import styled, { css } from 'styled-components';
import dfstyles from '../helpers/dfstyles';
import { artifactFileName } from '../helpers/ArtifactUtils';

export const ARTIFACT_URL = 'https://d2wspbczt15cqu.cloudfront.net/v0.6.0-artifacts/';


function getArtifactUrl(thumb: boolean, artifact: Artifact): string {
    const fileName = artifactFileName(true, thumb, artifact);
    return ARTIFACT_URL + fileName;
}

export function ArtifactImage({
    artifact,
    size,
    thumb,
}: {
    artifact: Artifact;
    size: number;
    thumb?: boolean;
}) {
    return (
        <Container width={size} height={size}>
            <video width={size} height={size} loop autoPlay key={artifact.id}>
                <source
                    src={getArtifactUrl(thumb || false, artifact)}
                    type={'video/webm'}
                />
            </video>
        </Container>
    );
}

const Container = styled.div`
  image-rendering: crisp-edges;
  ${({ width, height }: { width: number; height: number }) => css`
    width: ${width}px;
    height: ${height}px;
    min-width: ${width}px;
    min-height: ${height}px;
    background-color: ${dfstyles.colors.artifactBackground};
    display: inline-block;
  `}
`;