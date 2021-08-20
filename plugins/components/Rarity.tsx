import { h, FunctionComponent } from "preact";
import { ArtifactRarity, ArtifactTypeNames, ArtifactType } from "@darkforest_eth/types";
import { RarityColors } from "../helpers/styles";

const styles = {
  enabled: {},
  disabled: {
    backgroundColor: "#a0a0a0",
    color: "#080808",
    border: "1px solid #080808",
    outline: "none",
  },
};

type Props = {
    type: ArtifactType,
    rarity: ArtifactRarity;
};

export const Rarity: FunctionComponent<Props> = ({ rarity, type }) => {
    let rarityStyle = {
        marginLeft: '5px',
        marginRight: '10px',
        minWidth: '32px',
        color: RarityColors[rarity]
    }
    return (
        <span style={rarityStyle}>{ArtifactTypeNames[type]}</span>
    );
};
