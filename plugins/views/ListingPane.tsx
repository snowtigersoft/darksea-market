import { listStyle, table, textCenter, warning } from "../helpers/styles";
import React, { useState } from "react";
import { sortByKey } from "../helpers/helpers";
import { utils } from "ethers";
import { Multiplier } from "../components/Multiplier";
import styled from 'styled-components';
import { ArtifactRarityTypeLabelAnim } from "../components/labels/ArtifactLabels";
import { Btn } from "../components/Btn";
import { ArtifactDetail } from "../components/ArtifactDetail";
import { own } from "../contants";
import { Loading } from "../components/Loading";
import { SortableHeader } from "../components/SortableHeader";

const PriceCell = styled.div`
  text-align: right;
  padding-right: 5px;
`;

const defaultSort = [{key: 'rarity', d: -1}, {key: 'price', d: 1}];

export function ListingPane({selected, artifacts, loading, mine}) {
    if (!selected) {
        return null;
    }

    const [active, setActive] = useState(undefined);
    const [sort, setSort] = useState(defaultSort);
    
    const artifactChildren = artifacts.filter((artifact) => {
        return (artifact.owner === own && mine) || !mine
    }).sort(sortByKey(sort)).map(artifact => {
        const rows = [<tr key={artifact.id} style={table}>
            <td><ArtifactRarityTypeLabelAnim artifact={artifact} isOffer={false} /></td>
            <td><Multiplier mult={artifact.upgrade.energyCapMultiplier} /></td>
            <td><Multiplier mult={artifact.upgrade.energyGroMultiplier} /></td>
            <td><Multiplier mult={artifact.upgrade.rangeMultiplier} /></td>
            <td><Multiplier mult={artifact.upgrade.speedMultiplier} /></td>
            <td><Multiplier mult={artifact.upgrade.defMultiplier} /></td>
            <td><PriceCell>{utils.formatEther(artifact.price)}</PriceCell></td>
            <td><Btn onClick={() => setActive(artifact)}>{artifact.owner === own ? `Mine` : `View`}</Btn></td>
        </tr>];
        if (active && active.id == artifact.id) {
            rows.push(<tr key={artifact.id + "a"}>
                <td colSpan="8">
                    <ArtifactDetail artifact={artifact} onCancel={() => setActive(false)} />
                </td>
            </tr>)
        }
        return rows;
    });

    return (
        <div style={listStyle}>
            {loading ? <Loading /> :
            artifactChildren.length ? 
            <table style={table}>
                <SortableHeader sort={sort} setSort={setSort} defaultSort={defaultSort} withPrice={true} />
                <tbody>
                {artifactChildren}
                </tbody>
            </table> : <div style={textCenter}>No artifacts listing right now.</div>}
        </div>
    );
}