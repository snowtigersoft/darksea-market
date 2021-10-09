import React, { FunctionComponent } from "react";
import { Artifact } from "@darkforest_eth/types";
import { ArtifactRarityTypeLabelAnim } from "./labels/ArtifactLabels";


type Props = {
    artifact: Artifact
};

export const Rarity: FunctionComponent<Props> = ({ artifact }) => {
    let rarityStyle = {
        marginLeft: '5px',
        marginRight: '10px',
        minWidth: '32px',
    }
    return (
        <span style={rarityStyle}>
          <ArtifactRarityTypeLabelAnim artifact={artifact} isOffer={false}/>
        </span>
    );
};
