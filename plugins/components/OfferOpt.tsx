import { Btn } from "./Btn";
import { ButtonGroup } from "./CoreUI";
import React, { useState } from "react";
import { callAction, getRandomActionId } from "../helpers/helpers";
import { BigNumber, utils } from "ethers";
import { notifyManager, TOKENS_CONTRACT_ADDRESS, own } from "../contants";
import { useContract } from "../helpers/AppHooks";
import styled from "styled-components";

const Price = styled.div`
  font-size: 2em;
  font-weight: bold;
  text-align: center;
`;

export function OfferOpt({ artifact, onCancel, offer }) {
    const { market } = useContract();
    const [processing, setProcessing] = useState(false);
    const [show, setShow] = useState(true);

    function sell() {
        if (!processing) {
            setProcessing(true);
            let methodName = 'fillOffer';
            callAction(market, methodName,
                [TOKENS_CONTRACT_ADDRESS,
                    BigNumber.from(offer.offerId),
                    BigNumber.from('0x' + artifact.id)
                ]).then(() => {
                    setShow(false);
                }).catch((err) => {
                    console.error(err);
                    notifyManager.txInitError(methodName, err.message);
                }).finally(() => {
                    setProcessing(false);
                });
        }
    }


    return [
        <Price key="p">{`${utils.formatEther(offer.price)}xDai`}</Price>,
        <div key="b">
            <ButtonGroup>
                <Btn className="btn" disabled={processing || !show} onClick={sell}>{processing ? 'Waiting' : 'Sell'}</Btn>
                <Btn onClick={onCancel} className="btn">Cancel</Btn>
            </ButtonGroup>
        </div>
    ]
}