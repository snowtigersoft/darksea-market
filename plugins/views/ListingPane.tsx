import { listStyle } from "../helpers/styles";
import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { useState, useEffect } from "preact/hooks";
import { getLocalArtifact, setLocalArtifact, getRandomActionId, callAction } from "../helpers/helpers";
import { ArtifactTypeNames } from "@darkforest_eth/types";
import { own, notifyManager } from "../contants";
import { utils, BigNumber } from "ethers";
import { Rarity } from "../components/Rarity";
import { Multiplier } from "../components/Multiplier";
import { Button } from "../components/Button";
import { h } from "preact";
import {
    EnergyIcon,
    EnergyGrowthIcon,
    DefenseIcon,
    RangeIcon,
    SpeedIcon,
} from '../components/Icon';

const style = {
    marginLeft: '5px',
    marginRight: '10px',
    minWidth: '32px',
};

const wrapper = {
    display: 'flex',
    marginBottom: '10px',
};

function BuyButton({item, contract}) {
    let [processing, setProcessing] = useState(false);
    let [show, setShow] = useState(true);

    function buy() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'buy',
            };
            const overrids = {
                value: BigNumber.from(item.price).toString(),
                gasLimit: 500000,
            };
            callAction(contract, action, [BigNumber.from(item.listId)], overrids).then(()=>{
                setShow(false);
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.log(err);
                notifyManager.unsubmittedTxFail(action, err);
            });
        }
    }

    if (show) {
        return <Button onClick={buy} processing={processing} on="Waiting" off="Buy"/>;
    }
}

function UnlistButton({item, contract}) {
    let [processing, setProcessing] = useState(false);
    let [show, setShow] = useState(true);

    function unlist() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'unlist',
            };
            callAction(contract, action, [BigNumber.from(item.listId)]).then(()=>{
                setShow(false);
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.log(err);
                notifyManager.unsubmittedTxFail(action, err);
            });
        }
    }

    if (show) {
        return <Button onClick={unlist} processing={processing} on="Waiting" off="Unlist"/>;
    }
}

function ListItem({item, contract}) {
    const artifactId = artifactIdFromEthersBN(item.tokenID);
    const defaultArtifact = {
        id: artifactId,
        artifactType: item.artifactType,
        rarity: item.rarity,
        upgrade: {
            energyCapMultiplier: -1,
            energyGroMultiplier: -1,
            defMultiplier: -1,
            rangeMultiplier: -1,
            speedMultiplier: -1
        }
    };
    //@ts-expect-error
    const [artifact, setArtifact] = useState(getLocalArtifact(artifactId) || df.getArtifactWithId(artifactId) || defaultArtifact);

    if (artifact.upgrade.energyCapMultiplier === -1) {
        useEffect(() => {
            console.log(`[ArtifactsMarket] Loading artifact ${artifactId} from chain`);
            //@ts-expect-error
            df.contractsAPI.getArtifactById(artifactId).then((a) => {
                setArtifact(a);
                console.log(`[ArtifactsMarket] Loaded artifact ${artifactId} from chain`);
                console.log(artifact);
                console.log(a);
                setLocalArtifact(a);
            });
        }, [setArtifact]);
    }

    return (
        <div key={artifact.id} style={wrapper}>
            <span style={style}>{ArtifactTypeNames[artifact.artifactType]}</span>
            <Rarity rarity={artifact.rarity}/>
            <Multiplier Icon={EnergyIcon} bonus={artifact.upgrade.energyCapMultiplier}/>
            <Multiplier Icon={EnergyGrowthIcon} bonus={artifact.upgrade.energyGroMultiplier}/>
            <Multiplier Icon={DefenseIcon} bonus={artifact.upgrade.defMultiplier}/>
            <Multiplier Icon={RangeIcon} bonus={artifact.upgrade.rangeMultiplier}/>
            <Multiplier Icon={SpeedIcon} bonus={artifact.upgrade.speedMultiplier}/>
            <span style={style}>{utils.formatEther(item.price)}xDai</span>
            ${item.owner.toLowerCase() == own ? 
                <UnlistButton item={item} contract={contract}/>
             : <BuyButton item={item} contract={contract}/>
            }
        </div>
    );
}

export function ListingPane({selected, artifacts, contract}) {
    if (!selected) {
        return
    }

    console.log("[ArtifactsMarket] Building listing");

    let beware = {
        color: "red",
    };
      
    let warning = {
        textAlign: "center",
        marginBottom: "10px"
    };

    let artifactChildren = artifacts.map(item => {
        return <ListItem item={item} contract={contract}/>;
    });

    console.log("[ArtifactsMarket] Build listing");

    return (
        <div style={listStyle}>
            <div style={warning}>
                <span style={beware}>Beware:</span> You will be spending actual xDai here!
            </div>
            ${artifactChildren.length ? artifactChildren : 'No artifacts listing right now.'}
        </div>
    );
}