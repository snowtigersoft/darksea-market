import React from "react";
import { useContract } from "../helpers/AppHooks";
import { warning, textCenter } from "../helpers/styles";
import { isOfficialRound } from "../contants";

const Offical = () => {
    const { fee, creatorFee } = useContract();
    return (<div style={textCenter}>
        <span style={warning}>Beware:</span>
        {`Darksea will charge a ${fee + creatorFee}% fee!`} <br/> 
        <span>At least 20% of the fees will be donated to DF via Gitcoin.</span>
    </div>);
}

const Lobby = () => {
    const { fee, creatorFee } = useContract();
    return (<div style={textCenter}>
        <span style={warning}>Beware:</span>
        {`Darksea service fee: ${fee}%, Lobby creator fee: ${creatorFee}%`}
    </div>);
}

export const Beware = () => {
    return (isOfficialRound ? <Offical/> : <Lobby/>);
};
