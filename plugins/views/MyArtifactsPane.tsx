import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { Rarity } from "../components/Rarity";
import { Multiplier } from "../components/Multiplier";
import { listStyle } from "../helpers/styles";
import { Button } from "../components/Button";
import { ArtifactTypeNames } from "@darkforest_eth/types";
import { getRandomActionId, callAction } from "../helpers/helpers";
import { useState } from "preact/hooks";
import { BigNumber, utils } from "ethers";
import { notifyManager } from "../contants";
import { h } from "preact";
import {
    EnergyIcon,
    EnergyGrowthIcon,
    DefenseIcon,
    RangeIcon,
    SpeedIcon,
} from '../components/Icon';


function ListButton({ contract, artifact }) {
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
        if (!(+price > 0.01)) {
            alert("Please set price, must greater than 0.01");
            return;
        }
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'list',
            };
            callAction(contract, action,
                [BigNumber.from('0x' + artifact.id),
                artifact.artifactType,
                artifact.rarity,
                utils.parseEther(price.toString())
                ]).then(() => {
                    setShow(false);
                    setProcessing(false);
                }).catch((err) => {
                    setProcessing(false);
                    console.log(err);
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
                <input type="number" value="${price}" onChange={change} onKeyUp={onKeyUp} min={0} step={0.01} style={style} placeholder="XDAI"/>
                <Button onClick={list} processing={processing} on="Waiting" off="List" />
            </span>
        )
    }
}

export function MyArtifactsPane({ selected, artifacts, contract }) {
    if (!selected) {
        return
    }

    console.log("[ArtifactsMarket] Building my artifacts");

    let style = {
        marginLeft: '5px',
        marginRight: '10px',
        minWidth: '32px',
    };

    let list_ids = artifacts.map(p => artifactIdFromEthersBN(p.tokenID));
    //@ts-expect-error
    let my_artifacts = df.getMyArtifacts().filter(p => p.onPlanetId === undefined && !list_ids.includes(p.id));

    let artifactChildren = my_artifacts.map(artifact => {
        let wrapper = {
            display: 'flex',
            marginBottom: '10px',
        };

        return (
            <div key={artifact.id} style={wrapper}>
                <span style={style}>{ArtifactTypeNames[artifact.artifactType]}</span>
                <Rarity rarity={artifact.rarity} />
                <Multiplier Icon={EnergyIcon} bonus={artifact.upgrade.energyCapMultiplier} />
                <Multiplier Icon={EnergyGrowthIcon} bonus={artifact.upgrade.energyGroMultiplier} />
                <Multiplier Icon={DefenseIcon} bonus={artifact.upgrade.defMultiplier} />
                <Multiplier Icon={RangeIcon} bonus={artifact.upgrade.rangeMultiplier} />
                <Multiplier Icon={SpeedIcon} bonus={artifact.upgrade.speedMultiplier} />
                <ListButton artifact={artifact} contract={contract}/>
            </div>
        )
    });

    console.log("[ArtifactsMarket] Build my artifacts");

    return (<div style={listStyle}>
        {artifactChildren.length ? artifactChildren : 'No artifacts right now.'}
    </div>)
}