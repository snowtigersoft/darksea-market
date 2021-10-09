import {
    ArtifactId,
    ArtifactRarity,
    ArtifactType,
    Upgrade,
    EthAddress,
} from '@darkforest_eth/types';
import { BigNumber } from 'ethers';
import type { Any } from 'ts-toolbelt';

/**
 * An abstract type used to differentiate between common types, like `number` or `string`.
 * The `Id` type parameter is the key to vary upon and should be unique unless being used to subtype.
 */
export declare type Abstract<T, Id extends Any.Key> = Any.Type<T, Id>;
/**
 * Unwraps a Promise type into the type it contains. Useful when working with Promise-returning functions.
 */
export declare type Awaited<T> = Any.Await<T>;

export declare type ListingStatus = Abstract<number, 'ListingStatus'>;
/**
 * Enumeration of artifact rarity levels. Common = 1, Mythic = 5
 */
export declare const ListingStatus: {
    readonly Listed: ListingStatus;
    readonly Unlisted: ListingStatus;
    readonly Sold: ListingStatus;
};

export declare type ListingArtifact = {
    id: ArtifactId;
    rarity: ArtifactRarity;
    artifactType: ArtifactType;
    upgrade: Upgrade;
    price: BigNumber;
    owner: EthAddress;
    buyer: EthAddress;
    status: ListingStatus;
    listId: BigNumber;
    tokenID: BigNumber;
}

export declare type OfferArtifact = {
    offerId: BigNumber;
    qty: BigNumber;
    deal: BigNumber;
    buyer: EthAddress;
    price: BigNumber;
    tokenID: BigNumber;
    rarity: ArtifactRarity;
    artifactType: ArtifactType;
    status: ListingStatus;
}