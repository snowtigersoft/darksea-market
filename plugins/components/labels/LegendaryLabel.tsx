import { ArtifactRarity, ArtifactRarityNames } from '@darkforest_eth/types';
import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { RarityColors } from '../../helpers/styles';

const color = keyframes`
  0% {
    color: ${RarityColors[ArtifactRarity.Legendary]};
  }
  70% {
    color: ${RarityColors[ArtifactRarity.Legendary]};
  }
  100% {
    color: #ffffff;
  }
`;

const AnimDelay = styled.span<{ i: number }>`
  animation: ${color} 1s linear infinite alternate;
  ${({ i }) => `animation-delay: ${-i * 0.04}s;`}
`;

const Anim = styled.span`
  color: ${RarityColors[ArtifactRarity.Legendary]};
`;

export function LegendaryLabelText({ text }: { text: string }) {
  return (
    <Anim>
        {text.split('').map((c, i) => (
            <AnimDelay i={i} key={i}>
                {c === ' ' ? <>&nbsp;</> : c}
            </AnimDelay>
        ))}
    </Anim>
);
}

function LegendaryLabelRaw() {
    return (
        <LegendaryLabelText text={ArtifactRarityNames[ArtifactRarity.Legendary]} />
    );
}

export const LegendaryLabel = React.memo(LegendaryLabelRaw);