import React from "react";
import { useContract } from "../helpers/AppHooks";
import { warning, textCenter } from "../helpers/styles";

export const Beware = () => {
    const { fee } = useContract();

    return (<div style={textCenter}>
        <span style={warning}>Beware:</span> {`Darksea will charge a ${fee}% fee!`} <br/> 
        <span>At least 20% of the fees will be donated to DF via Gitcoin.</span>
    </div>);
};
