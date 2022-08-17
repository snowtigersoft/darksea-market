import { Button } from "../components/Button";
import { callAction } from "../helpers/helpers";
import React, { useState } from "react";
import { notifyManager } from "../contants";
import { useBalance, useContract } from "../helpers/AppHooks";
import styled from "styled-components";
import dfstyles from "../helpers/dfstyles";
import { utils } from "ethers";

const FooterBar = styled.div`
    padding: 8px 8px 0 8px;
    margin: 0 -8px;
    border-top: 1px solid ${dfstyles.colors.border};
`;

const Support = styled.a`
    float: right
`

function WithdrawButton({disabled}) {
    if (disabled) {
        return null;
    }

    const { market } = useContract();
    const [processing, setProcessing] = useState(false);

    function withdraw() {
        if (!processing) {
            setProcessing(true);
            let methodName = 'withdraw';
            callAction(market, methodName, []).then(()=>{
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.error(err);
                notifyManager.txInitError(methodName, err.message);
            });
        }
    }

    return <Button onClick={withdraw} processing={processing} on="Waiting" off="Withdraw"/>;
}


export function FooterPane() {
    const { balance } = useBalance();

    return (
        <FooterBar>
            {`Balance: ${utils.formatEther(balance)}xDai `}
            <WithdrawButton disabled={balance == 0}/>
            <Support href="https://gitcoin.co/grants/4280/dark-sea-marketplace-in-dark-forest" target="_blank">Support DarkSea</Support>
        </FooterBar>
    );
}