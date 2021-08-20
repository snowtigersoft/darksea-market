import { useState, useLayoutEffect } from "preact/hooks";
import { REFRESH_INTERVAL, own } from "../contants";
import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { ArtifactRarityNames, ArtifactTypeNames } from "@darkforest_eth/types";
import { notify } from "../helpers/helpers";
import { ListingPane } from "./ListingPane";
import { InventoryPane } from "./InventoryPane";
import { WithdrawButton } from "./WithdrawPane";
import { utils } from "ethers";
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

export function App({ artifacts, initBalance, fee, minPrice, contract }) {
    console.log("[ArtifactsMarket] Starting market");

    // ['listing', 'inventory', 'account']
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
            artifacts = artifacts.filter(p => !p.listId.eq(listId));
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
            } else if (artifact.owner.toLowerCase() === own) {
                notify(`Your ${rarity} ${artifactType} Sold.`);
            } else {
                notify(`You bought a ${rarity} ${artifactType}`);
            }
        }
        console.log("[ArtifactsMarket] Success");
        return artifact;
    }

    useLayoutEffect(() => {
        contract.on("Bought", onListingChange);
        contract.on("Listed", onListingChange);
        contract.on("Unlisted", onListingChange);

        return () => {
            contract.off("Bought", onListingChange);
            contract.off("Listed", onListingChange);
            contract.off("Unlisted", onListingChange);
        };
    }, []);

    return (
        <div>
            <div style={buttonBar}>
                <button onClick={() => setTab('listing')} style={tab === 'listing' ? activeButton : ''}>Listing</button>
                <button onClick={() => setTab('inventory')} style={tab === 'inventory' ? activeButton : ''}>Inventory</button>
            </div>
            <div>
                <ListingPane selected={tab === 'listing'} artifacts={listArtifacts} contract={contract} />
                <InventoryPane selected={tab === 'inventory'} artifacts={listArtifacts} contract={contract} fee={fee} minPrice={minPrice}/>
            </div>
            <div>{`Balance: ${utils.formatEther(balance)}xDai `}<WithdrawButton contract={contract} disabled={balance == 0}/></div>
        </div>
    );
}