import { ArtifactRarity } from "@darkforest_eth/types";

export const listStyle = {
    maxHeight: '400px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    width: '100%',
};

export const RarityColors = {
    [ArtifactRarity.Unknown]: 'rgb(131, 131, 131)',
    [ArtifactRarity.Common]: 'rgb(131, 131, 131)',
    [ArtifactRarity.Rare]: '#6b68ff',
    [ArtifactRarity.Epic]: '#c13cff',
    [ArtifactRarity.Legendary]: '#f8b73e',
    [ArtifactRarity.Mythic]: '#ff44b7',
}

export const warning = {
    color: "red",
};

export const textCenter = {
    textAlign: "center",
    marginBottom: "10px"
};

export const table = {
    lineHeight: '34px',
    width: '100%'
};

export const inputStyle = {
    outline: "none",
    background: "rgb(21, 21, 21)",
    color: "rgb(131, 131, 131)",
    borderRadius: "4px",
    border: "1px solid rgb(95, 95, 95)",
    width: 60,
    padding: "0 2px",
    height: "1.5em",
};

export const buttonStyle = (processing=false) => {
    return {
        marginLeft: '5px',
        opacity: processing ? '0.5' : '1',
        lineHeight: "1.5em"
    }
};