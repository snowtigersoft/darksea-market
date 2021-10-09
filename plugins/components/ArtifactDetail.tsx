import React from 'react';
import { Upgrade } from "@darkforest_eth/types";
import _ from 'lodash';
import styled from 'styled-components';
import dfstyles from "../helpers/dfstyles";
import { ArtifactImage } from "./ArtifactImage";
import { Spacer } from './CoreUI';
import { StatIcon } from "./Icon";
import { ArtifactRarityLabelAnim, ArtifactTypeText } from "./labels/ArtifactLabels";
import { Multiplier } from "./Multiplier";
import { InventoryOpt } from "./InventoryOpt";
import { MarketOpt } from "./MarketOpt";
import { OfferOpt } from "./OfferOpt";
import { getUpgradeStat } from '../helpers/helpers';

const ArtifactDetailWrapper = styled.div`
  min-height: 128px;
  margin: 0 1em 1em 1em;
  display: flex;
  flex-direction: row;
  & > div::last-child {
    flex-grow: 1;
  }
  .statrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & > span:first-child {
      margin-right: 1.5em;
    }
    & > span:last-child {
      text-align: right;
      width: 3em;
      flex-grow: 1;
    }
  }
`;

const ArtifactNameSubtitle = styled.div`
  color: ${dfstyles.colors.subtext};
  margin-bottom: 8px;
  width: 13em;
  text-align: center;
`;

const StatsContainer = styled.div`
  flex-grow: 1;
  line-height: 1.5em;
  width: 4em;
`;

function UpgradeStatInfo({
    upgrades,
    stat,
}: {
    upgrades: (Upgrade | undefined)[];
    stat: number;
}) {
    let mult = 100;

    for (const upgrade of upgrades) {
        if (upgrade) {
            mult *= getUpgradeStat(upgrade, stat) / 100;
        }
    }

    return (
        <div className='statrow'>
            <StatIcon stat={stat} />
            <Multiplier mult={mult} />
        </div>
    );
}

export function ArtifactDetail({ artifact, onCancel, offer }) {
    return (
        <ArtifactDetailWrapper>
            <ArtifactImage artifact={artifact} size={128} />
            <Spacer width={8} />
            <StatsContainer>
                {_.range(0, 5).map((val) => (
                    <UpgradeStatInfo
                        upgrades={[artifact.upgrade, artifact.timeDelayedUpgrade]}
                        stat={val}
                        key={val}
                    />
                ))}
            </StatsContainer>
            <Spacer width={20} />
            <div>
                <ArtifactNameSubtitle>
                    <ArtifactRarityLabelAnim artifact={artifact} />{' '}
                    <ArtifactTypeText artifact={artifact} isOffer={false} />
                </ArtifactNameSubtitle>
                {offer ? <OfferOpt onCancel={onCancel} artifact={artifact} offer={offer} /> : 
                artifact.price ? 
                <MarketOpt onCancel={onCancel} artifact={artifact} /> : 
                <InventoryOpt onCancel={onCancel} artifact={artifact} />}
            </div>
        </ArtifactDetailWrapper>
    );
}