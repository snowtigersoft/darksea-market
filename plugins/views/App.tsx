import React, { useState } from "react";
import { ListingPane } from "./ListingPane";
import { InventoryPane } from "./InventoryPane";
import { FooterPane } from "./FooterPane";
import { ContractProvider } from "../helpers/ContractContext";
import { useListingArtifacts } from "../helpers/AppHooks";

const buttonBar = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px',
};

const activeButton = {
    background: '#fff',
    color: '#000'
}

export function App({ contract }) {
    console.log("[DarkSeaMarket] Starting market");

    // ['listing', 'inventory']
    const [tab, setTab] = useState('listing');
    const { listingArtifacts, loading } = useListingArtifacts(contract.market, 10000);
    const artifacts = listingArtifacts.value || [];

    return (
        <ContractProvider value={contract}>
            <div>
                <div style={buttonBar}>
                    <button onClick={() => setTab('listing')} style={tab === 'listing' ? activeButton : {}}>Listing</button>
                </div>
                <div>
                    <ListingPane selected={tab === 'listing'} artifacts={artifacts} loading={loading} mine={true}/>
                    <InventoryPane selected={tab === 'inventory'}/>
                </div>
                <FooterPane/>
            </div>
        </ContractProvider>
    );
}