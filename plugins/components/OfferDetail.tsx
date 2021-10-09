import React, { useState } from 'react';
import { ArtifactType } from "@darkforest_eth/types";
import _ from 'lodash';
import styled from 'styled-components';
import { Multiplier } from "./Multiplier";
import { useMyArtifactsList } from "../helpers/AppHooks";
import { table, listStyle, textCenter } from "../helpers/styles";
import { ArtifactRarityTypeLabelAnim } from "./labels/ArtifactLabels";
import { Btn } from "./Btn";
import { sortByKey } from "../helpers/helpers";
import { SortableHeader } from "./SortableHeader";
import { ArtifactDetail } from './ArtifactDetail';


const OfferDetailWrapper = styled.div`
  min-height: 50px;
  padding: .5em;
  background: #001;
`;

const defaultSort = [{ key: 'rarity', d: -1 }];

export function OfferDetail({ offer }) {
    const [sort, setSort] = useState(defaultSort);
    const [active, setActive] = useState(undefined);
    const my_artifacts = useMyArtifactsList();

    let artifactChildren = my_artifacts
        .filter(artifact => artifact.rarity == offer.rarity && (offer.artifactType == ArtifactType.Unknown || offer.artifactType == artifact.artifactType))
        .sort(sortByKey(sort))
        .map(artifact => {
            const rows = [<tr key={artifact.id} style={table}>
                <td><ArtifactRarityTypeLabelAnim artifact={artifact} isOffer={false} /></td>
                <td><Multiplier mult={artifact.upgrade.energyCapMultiplier} /></td>
                <td><Multiplier mult={artifact.upgrade.energyGroMultiplier} /></td>
                <td><Multiplier mult={artifact.upgrade.rangeMultiplier} /></td>
                <td><Multiplier mult={artifact.upgrade.speedMultiplier} /></td>
                <td><Multiplier mult={artifact.upgrade.defMultiplier} /></td>
                <td><Btn onClick={() => setActive(artifact)}>Sell</Btn></td>
            </tr>];
            if (active && active.id == artifact.id) {
                rows.push(<tr key={artifact.id + "a"}>
                    <td colSpan="7">
                        <ArtifactDetail artifact={artifact} onCancel={() => setActive(false)} offer={offer} />
                    </td>
                </tr>)
            }
            return rows;
        });

    return (
        <OfferDetailWrapper>
            <div style={listStyle}>
                {artifactChildren.length ?
                    <table style={table}>
                        <SortableHeader sort={sort} setSort={setSort} defaultSort={defaultSort} withPrice={false} />
                        <tbody>{artifactChildren}</tbody>
                    </table> :
                    <div style={textCenter}>No artifacts fit this offer.</div>}
            </div>
        </OfferDetailWrapper>
    );
}