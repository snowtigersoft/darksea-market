import {
    Artifact,
    ArtifactId,
    ArtifactRarity,
    ArtifactRarityNames,
    ArtifactTypeNames,
    Biome,
    EthAddress,
} from '@darkforest_eth/types';
import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { ListingArtifact } from './types';
import { MARKET_CONTRACT_ADDRESS, own } from '../contants';
import { ContractContext } from "./ContractContext";
import { getAllArtifacts, notify } from './helpers';
import { artifactIdFromEthersBN } from '@darkforest_eth/serde';


/**
 * React uses referential identity to detect changes, and rerender. Rather
 * than copying an object into a new object, to force a rerender, we can
 * just wrap it in a new {@code Wrapper}, which will force a rerender.
 */
export class Wrapper<T> {
    public readonly value: T;

    public constructor(value: T) {
        this.value = value;
    }

    public or(wrapper: Wrapper<T>) {
        return new Wrapper(this.value || wrapper.value);
    }
}

/**
 * Executes the callback `cb` every `poll` ms
 * @param cb callback to execute
 * @param poll ms to poll
 * @param execFirst if we want to execute the callback on first render
 */
export function usePoll(
    cb: () => void,
    poll: number | undefined = undefined,
    execFirst: boolean | undefined = undefined
) {
    useEffect(() => {
        if (execFirst) cb();

        if (!poll) return;
        const interval = setInterval(cb, poll);

        return () => clearInterval(interval);
    }, [poll, cb, execFirst]);
}

export const useContract = () => useContext(ContractContext);

export function useMyArtifacts(): Wrapper<Artifact[]> {
    //@ts-expect-error
    const [myArtifacts, setMyArtifacts] = useState(new Wrapper(df.getMyArtifactMap()));

    useEffect(() => {
        const interval = setInterval(() => {
            //@ts-expect-error
            setMyArtifacts(new Wrapper(df.getMyArtifactMap()));
        }, 1000);
        return () => clearInterval(interval);
    });

    return myArtifacts;
}

export function useMyArtifactsList() {
    const myArtifactsMap = useMyArtifacts();
    return Array.from(myArtifactsMap.value?.values() || []);
}

export function useListingArtifacts(market, poll: number | undefined = undefined) {
    //const { market } = useContract();
    const [listingArtifacts, setListingArtifacts] = useState<Wrapper<ListingArtifact[]>>(new Wrapper([]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime());

    function buildArfifact({item, artifact=undefined}) {
        const artifactId = artifactIdFromEthersBN(item.tokenID);
        //@ts-expect-error
        artifact = artifact || df.getArtifactWithId(artifactId) || {
            id: artifactId,
            artifactType: item.artifactType,
            rarity: ArtifactRarity.Unknown,
            planetBiome: Biome.UNKNOWN,
            upgrade: {
                energyCapMultiplier: -1,
                energyGroMultiplier: -1,
                defMultiplier: -1,
                rangeMultiplier: -1,
                speedMultiplier: -1
            },
            timeDelayedUpgrade: {
                energyCapMultiplier: -1,
                energyGroMultiplier: -1,
                defMultiplier: -1,
                rangeMultiplier: -1,
                speedMultiplier: -1
            }
        };
        return {
            ...artifact,
            owner: item.owner.toLowerCase(),
            buyer: item.buyer.toLowerCase(),
            price: item.price,
            status: item.status,
            listId: item.listId,
            tokenID: item.tokenID,
        };
    }

    async function onListingChange(listId) {
        console.log("[DarkSeaMarket] On listing change");
        const item = await market.getArtifact(listId);
        const artifact = buildArfifact({item: item});
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load();
        }
        console.log(`[DarkSeaMarket] Artifact ${artifact.id} update`);
        if (artifact.owner === own || artifact.buyer === own) {
            console.log(`[DarkSeaMarket] Update local game`)
            //@ts-expect-error
            df.contractsAPI.emit('ArtifactUpdate', artifact.tokenID);
            //@ts-expect-error
            await df.hardRefreshArtifact(artifact.id);
            const artifactType = ArtifactTypeNames[artifact.artifactType];
            const rarity = ArtifactRarityNames[artifact.rarity];
            if (artifact.status === 0) {
                notify(`Your ${rarity} ${artifactType} Listed.`);
            } else if (artifact.status === 1) {
                notify(`Your ${rarity} ${artifactType} Unlisted.`);
            } else if (artifact.owner === own) {
                notify(`Your ${rarity} ${artifactType} Sold.`);
            } else {
                notify(`You bought a ${rarity} ${artifactType}`);
            }
        }
        console.log("[DarkSeaMarket] Success");
        return artifact;
    }

    const load = useCallback(async function load() {
        try {
            console.log("[DarkSeaMarket] Loading listing artifacts");
            setLastRefreshTime(new Date().getTime());
            let artifacts = await getAllArtifacts(market);
            //@ts-expect-error
            const afs = await df.contractsAPI.getPlayerArtifacts(MARKET_CONTRACT_ADDRESS);
            const gas = {};
            afs.forEach(a=>gas[a.id]=a);
            artifacts = artifacts.map(item => buildArfifact({item: item, artifact: gas[artifactIdFromEthersBN(item.tokenID)]}))
            setListingArtifacts(new Wrapper(artifacts));
            setLoading(false);
            console.info("[DarkSeaMarket] Loading listing artifacts success");
        } catch (e) {
            console.log('[DarkSeaMarket] error loading listing artifacts', e);
            setLoading(false);
            setError(e);
        }
    }, [listingArtifacts]);

    useEffect(() => {
        market.on("Bought", onListingChange);
        market.on("Listed", onListingChange);
        market.on("Unlisted", onListingChange);

        return () => {
            market.off("Bought", onListingChange);
            market.off("Listed", onListingChange);
            market.off("Unlisted", onListingChange);
        };
    }, [listingArtifacts]);
    
    usePoll(load, poll, listingArtifacts.value.length == 0);
    return { listingArtifacts, loading, error };
}

export function useBalance() {
    const { market } = useContract();
    const [balance, setBalance] = useState(0);

    async function updateBalance(listId) {
        const artifact = await market.getArtifact(listId);
        if (artifact.owner.toLowerCase() === own || artifact.buyer.toLowerCase() === own) {
            setBalance(await market.getMyBalance());
        }
    }

    useEffect(() => {
        market.on("Bought", updateBalance);
        market.on("Listed", updateBalance);
        market.on("Unlisted", updateBalance);

        return () => {
            market.off("Bought", updateBalance);
            market.off("Listed", updateBalance);
            market.off("Unlisted", updateBalance);
        };
    }, []);

    useEffect(() => {
        market.getMyBalance().then(b => setBalance(b));    
    }, []);

    return { balance };
}