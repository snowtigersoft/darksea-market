import { useState, useLayoutEffect } from "preact/hooks";
import { REFRESH_INTERVAL, own } from "../contants";
import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { ArtifactRarityNames, ArtifactTypeNames } from "@darkforest_eth/types";
import { notify } from "../helpers/helpers";
import { ListingPane } from "./ListingPane";
import { MyArtifactsPane } from "./MyArtifactsPane";
import { WithdrawPane } from "./WithdrawPane";
import { h } from "preact";

const buttonBar = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px',
};

const activeButton = {
    background: '#fff',
    color: '#000'
}

export function App({ artifacts, initBalance, fee, contract }) {
    console.log("[ArtifactsMarket] Starting market");

    // ['listing', 'my_artifacts', 'account']
    let [tab, setTab] = useState('listing');
    let [balance, setBalance] = useState(initBalance);
    let [listArtifacts, setListArtifacts] = useState(artifacts);
    let [_, setLoop] = useState(0);

    useLayoutEffect(() => {
        let intervalId = setInterval(() => {
            setLoop(loop => loop + 1)
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    async function onListingChange(listId) {
        console.log("[ArtifactsMarket] Get market items");
        const artifact = await contract.getArtifact(listId);
        if (artifact.status === 0) {
            artifacts.push(artifact);
        } else {
            artifacts = artifacts.filter(p => p.listId !== listId);
        }
        setListArtifacts([...artifacts]);
        console.log(`[ArtifactsMarket] Artifact ${artifactIdFromEthersBN(artifact.tokenID)} update`);
        if (artifact.owner.toLowerCase() === own || artifact.buyer.toLowerCase() === own) {
            console.log(`[ArtifactsMarket] Update local game`)
            //@ts-expect-error
            df.contractsAPI.emit('ArtifactUpdate', artifact.tokenID);
            //@ts-expect-error
            await df.hardRefreshArtifact(artifactIdFromEthersBN(artifact.tokenID));
            setBalance(await contract.getMyBalance());
            let artifactType = ArtifactTypeNames[artifact.artifactType];
            let rarity = ArtifactRarityNames[artifact.rarity];
            if (artifact.status === 0) {
                notify(`Your ${rarity} ${artifactType} Listed.`);
            } else if (artifact.status === 1) {
                notify(`Your ${rarity} ${artifactType} Unlisted.`);
            } else if (artifact.owner === own) {
                notify(`Your ${rarity} ${artifactType} Sold.`);
            } else {
                notify(`Your bought a ${rarity} ${artifactType}`);
            }
        }
        console.log("[ArtifactsMarket] Success");
        return artifact;
    }

    useLayoutEffect(() => {
        console.log(">>>>>>>>>>>");
        contract.on("Bought", onListingChange);
        contract.on("Listed", onListingChange);
        contract.on("Unlisted", onListingChange);

        return () => {
            contract.off("Bought", onListingChange);
            contract.off("Listed", onListingChange);
            contract.off("Unlisted", onListingChange);
        };
    }, []);

    console.log(listArtifacts);

    return (
        <div>
            <div style={buttonBar}>
                <button onClick={() => setTab('listing')} style={tab === 'listing' ? activeButton : ''}>Listing</button>
                <button onClick={() => setTab('my_artifacts')} style={tab === 'my_artifacts' ? activeButton : ''}>My Artifacts</button>
                <button onClick={() => setTab('account')} style={tab === 'account' ? activeButton : ''}>Account</button>
            </div>
            <div>
                <ListingPane selected={tab === 'listing'} artifacts={listArtifacts} contract={contract} />
                <MyArtifactsPane selected={tab === 'my_artifacts'} artifacts={listArtifacts} contract={contract} />
                <WithdrawPane selected={tab === 'account'} balance={balance} contract={contract} fee={fee} />
            </div>
        </div>
    );
}