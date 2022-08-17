import { Input } from "./Input";
import { Btn } from "./Btn";
import { ButtonGroup } from "./CoreUI";
import React, { useState } from "react";
import { callAction, getRandomActionId } from "../helpers/helpers";
import { BigNumber, utils } from "ethers";
import { EMPTY_ADDRESS, TOKENS_CONTRACT_ADDRESS, notifyManager } from "../contants";
import { useContract } from "../helpers/AppHooks";

export function InventoryOpt({ artifact, onCancel }) {
    const { minPrice, market } = useContract();
    const [processing, setProcessing] = useState(false);
    const [price, setPrice] = useState("");
    const [show, setShow] = useState(true);

    function change(e) {
        const { value } = e.currentTarget;
        try {
            utils.parseEther(value);
            setPrice(value);
        } catch (err) {
            console.error("[DarkSeaMarket] Not a valid Ether value.");
        }
    }

    function list() {
        if (!(+price >= minPrice)) {
            alert(`Please set price, must greater than ${minPrice}`);
            return;
        }
        if (!processing) {
            setProcessing(true);
            let methodName = 'list';
            callAction(market, methodName,
                [TOKENS_CONTRACT_ADDRESS,
                EMPTY_ADDRESS,
                BigNumber.from('0x' + artifact.id), 
                utils.parseEther(price.toString())
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

    function onKeyUp(e) {
        e.stopPropagation();
    }
    
    return [
        <div className='statrow' key="p">
            <span>Price</span>
            <span><Input placeholder="XDAI" wide={true} type="number" value={price} onChange={change} onKeyUp={onKeyUp} min={minPrice} step={0.01}/></span>
        </div>,
        <div key="b">
            <ButtonGroup>
                <Btn className="btn" disabled={processing || !show} onClick={list}>{processing ? 'Waiting': 'List'}</Btn>
                <Btn onClick={onCancel} className="btn">Cancel</Btn>
            </ButtonGroup>
        </div>
    ]
}