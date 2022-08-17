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
import { ListingArtifact, OfferArtifact } from './types';
import { MARKET_CONTRACT_ADDRESS, TOKENS_CONTRACT_ADDRESS, own } from '../contants';
import { ContractContext } from "./ContractContext";
import { getAllArtifacts, getAllOffers, notify, log } from './helpers';
import { artifactIdFromEthersBN } from '@darkforest_eth/serde';
import { utils } from 'ethers';


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
        const interval = setInterval(() => cb(), poll);

        log(`Interval ${interval} created`, 'debug');

        return () => {
            log(`Interval ${interval} cleared`, 'debug');
            clearInterval(interval)
        };
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
    }, []);

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

    async function onListingChange(token, listId) {
        log("On listing change", 'info');
        const item = await market.getItem(TOKENS_CONTRACT_ADDRESS, listId);
        const artifact = buildArfifact({item: item});
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load();
        }
        log(`Artifact ${artifact.id} update`, 'info');
        if (artifact.owner === own || artifact.buyer === own) {
            log(`Update local game`, 'info')
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
        log("Success", 'info');
        return artifact;
    }

    const load = useCallback(async function load() {
        try {
            log("Loading listing artifacts", 'debug');
            setLastRefreshTime(new Date().getTime());
            let artifacts = await getAllArtifacts(market);
            //@ts-expect-error
            const afs = await df.contractsAPI.getPlayerArtifacts(MARKET_CONTRACT_ADDRESS);
            const gas = {};
            afs.forEach(a=>gas[a.id]=a);
            artifacts = artifacts.map(item => buildArfifact({item: item, artifact: gas[artifactIdFromEthersBN(item.tokenID)]}))
            setListingArtifacts(new Wrapper(artifacts));
            log("Loading listing artifacts success", 'debug');
        } catch (e) {
            log('error loading listing artifacts', 'error', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        market.on("Bought", onListingChange);
        market.on("Listed", onListingChange);
        market.on("Unlisted", onListingChange);

        return () => {
            market.off("Bought", onListingChange);
            market.off("Listed", onListingChange);
            market.off("Unlisted", onListingChange);
            setLastRefreshTime(new Date().getTime());
            setListingArtifacts(new Wrapper([]));
            setLoading(false);
            setError(undefined);
        };
    }, []);
    
    usePoll(load, poll, listingArtifacts.value.length == 0);
    return { listingArtifacts, loading, error };
}

export function useOfferArtifacts(market, poll: number | undefined = undefined) {
    //const { market } = useContract();
    const [offerArtifacts, setOfferArtifacts] = useState<Wrapper<OfferArtifact[]>>(new Wrapper([]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();
    const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime());

    async function onOfferChange(token, offerId) {
        log("On offer change", 'info');
        if (new Date().getTime() - lastRefreshTime > 1000) {
            load();
        }
        log("Success", 'info');
    }

    const load = useCallback(async function load() {
        try {
            log("Loading offers", 'debug');
            setLastRefreshTime(new Date().getTime());
            let offers = await getAllOffers(market);
            setOfferArtifacts(new Wrapper(offers));
            log("Loading offers success", 'debug');
        } catch (e) {
            log('error loading offers', 'error', e);
            setError(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        market.on("PlacedOffer", onOfferChange);
        market.on("CancelOffer", onOfferChange);
        market.on("FillOffer", onOfferChange);

        return () => {
            market.off("PlacedOffer", onOfferChange);
            market.off("CancelOffer", onOfferChange);
            market.off("FillOffer", onOfferChange);
            setLastRefreshTime(new Date().getTime());
            setOfferArtifacts(new Wrapper([]));
            setLoading(false);
            setError(undefined);
        };
    }, []);
    
    usePoll(load, poll, offerArtifacts.value.length == 0);
    return { offerArtifacts, loading, error };
}

export function useBalance() {
    const { market } = useContract();
    const [balance, setBalance] = useState(0);

    async function updateBalance() {
        setBalance(await market.getMyBalance());
    }

    useEffect(() => {
        market.on("Bought", updateBalance);
        market.on("FillOffer", updateBalance);
        market.on("Withdraw", updateBalance);

        return () => {
            market.off("Bought", updateBalance);
            market.off("FillOffer", updateBalance);
            market.off("Withdraw", updateBalance);
        };
    }, []);

    useEffect(() => {
        market.getMyBalance().then(b => setBalance(b));
    }, []);

    return { balance };
}

export function useCreatorFees() {
    const { market } = useContract();
    const [fee, setFee] = useState(0);

    const load = useCallback(async function load() {
        try {
            const fee = await market.getCollectionFeeBalance(TOKENS_CONTRACT_ADDRESS);
            setFee(fee);
        } catch (e) {
            log('error loading creator fees', 'error', e);
        }
    }, []);

    usePoll(load, 10000, true);

    return { fee };
}

export function useInfo(market) {
    const [isInMarket, setIsInMarket] = useState(undefined);
    const [fee, setFee] = useState(0);
    const [creatorFee, setCreatorFee] = useState(2);
    const [minPrice, setMinPrice] = useState(0.1);
    const [isMarketAdmin, setIsMarketAdmin] = useState(false);

    async function FeeChanged(fee) {
        setFee(parseInt(fee, 10)/100);
    }

    async function MinPriceChanged(token, minPrice) {
        if (token.toLowerCase() === TOKENS_CONTRACT_ADDRESS.toLowerCase()) {
            setMinPrice(utils.formatEther(minPrice));
        }
    }

    async function CollectionFeeChanged(token, fee) {
        if (token.toLowerCase() === TOKENS_CONTRACT_ADDRESS.toLowerCase()) {
            setCreatorFee(parseInt(fee, 10)/100);
        }
    }

    async function collectionChange(token, owner, fee, minPrice) {
        if (token.toLowerCase() === TOKENS_CONTRACT_ADDRESS.toLowerCase()) {
            setCreatorFee(parseInt(fee, 10)/100);
            setMinPrice(utils.formatEther(minPrice));
            setIsInMarket(true);
            setIsMarketAdmin(owner.toLowerCase() === own.toLowerCase());
        }
    }

    useEffect(() => {
        market.on("FeeChanged", FeeChanged);
        market.on("MinPriceChanged", MinPriceChanged);
        market.on("CollectionFeeChanged", CollectionFeeChanged);
        market.on("AddCollection", collectionChange);
        market.on("EditCollection", collectionChange);

        return () => {
            market.off("FeeChanged", FeeChanged);
            market.off("MinPriceChanged", MinPriceChanged);
            market.off("CollectionFeeChanged", CollectionFeeChanged);
            market.off("AddCollection", collectionChange);
            market.off("EditCollection", collectionChange);
        };
    }, []);

    useEffect(() => {
        market.getFee().then(b => setFee(parseInt(b, 10)/100));
        market.isInMarket(TOKENS_CONTRACT_ADDRESS).then((b) => {
            if (b) {
                market.getCollectionFee(TOKENS_CONTRACT_ADDRESS).then(b => setCreatorFee(parseInt(b, 10)/100));
                market.getCollectionMinPrice(TOKENS_CONTRACT_ADDRESS).then(b => setMinPrice(utils.formatEther(b)));
                market.getCollectionOwner(TOKENS_CONTRACT_ADDRESS).then(b => setIsMarketAdmin(b.toLowerCase() === own.toLowerCase()));
            }
            setIsInMarket(b);
        })
    }, []);

    return { fee, creatorFee, minPrice, isInMarket, isMarketAdmin };
}