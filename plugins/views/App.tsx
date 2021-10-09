import React, { useState } from "react";
import { ListingPane } from "./ListingPane";
import { InventoryPane } from "./InventoryPane";
import { FooterPane } from "./FooterPane";
import { ContractProvider } from "../helpers/ContractContext";
import { useListingArtifacts, useOfferArtifacts } from "../helpers/AppHooks";
import { OfferPane } from "./OfferPane";
import styled from 'styled-components';

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
`;

const Main = styled.div`
    padding: 0 0 10px 0;
`

const activeButton = {
    background: '#fff',
    color: '#000'
}

export function App({ contract }) {
    console.log("[DarkSeaMarket] Starting market");

    // ['market', 'listing', 'inventory']
    const [tab, setTab] = useState('market');
    const { listingArtifacts, loading } = useListingArtifacts(contract.market, 60000);
    const { offerArtifacts, loadingOffer } = useOfferArtifacts(contract.market, 60000);
    const artifacts = listingArtifacts.value || [];
    const offers = offerArtifacts.value || [];

    return (
        <ContractProvider value={contract}>
            <div>
                <ButtonBar>
                    <button onClick={() => setTab('market')} style={tab === 'market' ? activeButton : {}}>Market</button>
                    <button onClick={() => setTab('listing')} style={tab === 'listing' ? activeButton : {}}>Listing</button>
                    <button onClick={() => setTab('inventory')} style={tab === 'inventory' ? activeButton : {}}>Inventory</button>
                    <button onClick={() => setTab('offer')} style={tab === 'offer' ? activeButton : {}}>Offers</button>
                    <button onClick={() => setTab('myOffer')} style={tab === 'myOffer' ? activeButton : {}}>My Offers</button>
                </ButtonBar>
                <Main>
                    <ListingPane selected={tab === 'market'} artifacts={artifacts} loading={loading} mine={false}/>
                    <ListingPane selected={tab === 'listing'} artifacts={artifacts} loading={loading} mine={true}/>
                    <InventoryPane selected={tab === 'inventory'}/>
                    <OfferPane selected={tab === 'offer'} offers={offers} loading={loadingOffer} mine={false}/>
                    <OfferPane selected={tab === 'myOffer'} offers={offers} loading={loadingOffer} mine={true}/>
                </Main>
                <FooterPane/>
            </div>
        </ContractProvider>
    );
}