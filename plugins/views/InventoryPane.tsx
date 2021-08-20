import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { Rarity } from "../components/Rarity";
import { Multiplier } from "../components/Multiplier";
import { listStyle, table, textCenter, warning, inputStyle } from "../helpers/styles";
import { Button } from "../components/Button";
import { getRandomActionId, callAction } from "../helpers/helpers";
import { useState } from "preact/hooks";
import { BigNumber, utils } from "ethers";
import { notifyManager, EMPTY_ADDRESS } from "../contants";
import { h } from "preact";
import {
    EnergyIcon,
    EnergyGrowthIcon,
    DefenseIcon,
    RangeIcon,
    SpeedIcon,
} from '../components/Icon';


function ListButton({ contract, artifact, minPrice }) {
    let [processing, setProcessing] = useState(false);
    let [price, setPrice] = useState("");
    let [show, setShow] = useState(true);

    function change(e) {
        const { value } = e.currentTarget;
        try {
            setPrice(value);
        } catch (err) {
            console.error("[ArtifactMarket] Not a valid Ether value.");
        }
    }

    function list() {
        if (!(+price >= minPrice)) {
            alert(`Please set price, must greater than ${minPrice}`);
            return;
        }
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'list',
            };
            callAction(contract, action,
                [EMPTY_ADDRESS,
                BigNumber.from('0x' + artifact.id), 
                artifact.artifactType,
                artifact.rarity,
                utils.parseEther(price.toString())
                ]).then(() => {
                    setShow(false);
                    setProcessing(false);
                }).catch((err) => {
                    setProcessing(false);
                    console.error(err);
                    notifyManager.unsubmittedTxFail(action, err);
                });
        }
    }

    let style = {
        width: '3em',
        color: '#000'
    }

    function onKeyUp(e) {
        e.stopPropagation();
    }

    if (show) {
        return (
            <span>
                <input type="number" value={price} onChange={change} onKeyUp={onKeyUp} min={minPrice} step={0.01} style={inputStyle} placeholder="XDAI"/>
                <Button onClick={list} processing={processing} on="Waiting" off="List" />
            </span>
        )
    }
}

export function InventoryPane({ selected, artifacts, contract, fee , minPrice }) {
    if (!selected) {
        return
    }

    console.log("[ArtifactsMarket] Building my artifacts");

    let list_ids = artifacts.map(p => artifactIdFromEthersBN(p.tokenID));
    //@ts-expect-error
    let my_artifacts = df.getMyArtifacts().filter(p => p.onPlanetId === undefined && !list_ids.includes(p.id));

    let artifactChildren = my_artifacts.map(artifact => {
        return (
            <tr key={artifact.id} style={table}>
                <td><Rarity rarity={artifact.rarity} type={artifact.artifactType}/></td>
                <td><Multiplier Icon={EnergyIcon} bonus={artifact.upgrade.energyCapMultiplier} /></td>
                <td><Multiplier Icon={EnergyGrowthIcon} bonus={artifact.upgrade.energyGroMultiplier} /></td>
                <td><Multiplier Icon={DefenseIcon} bonus={artifact.upgrade.defMultiplier} /></td>
                <td><Multiplier Icon={RangeIcon} bonus={artifact.upgrade.rangeMultiplier} /></td>
                <td><Multiplier Icon={SpeedIcon} bonus={artifact.upgrade.speedMultiplier} /></td>
                <td><ListButton artifact={artifact} contract={contract} minPrice={minPrice}/></td>
            </tr>
        )
    });

    console.log("[ArtifactsMarket] Build my artifacts");

    return (<div style={listStyle}>
        <div style={textCenter}>
            <span style={warning}>Beware:</span> {`Darksae will charge a ${fee}% fee !`}
        </div>
        {artifactChildren.length ? <table>{artifactChildren}</table> : <div style={textCenter}>No artifacts right now.</div>}
    </div>)
}