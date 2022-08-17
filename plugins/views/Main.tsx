import React, {useState, useEffect} from "react";
import {ListingPane} from "./ListingPane";
import {InventoryPane} from "./InventoryPane";
import {FooterPane} from "./FooterPane";
import {AdminPanel} from "./AdminPanel";
import {useContract} from "../helpers/AppHooks";
import {OfferPane} from "./OfferPane";
import styled from 'styled-components';
import {isGameAdmin} from '../contants';
import {Loading} from "../components/Loading";

const ButtonBar = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
`;

const MainDiv = styled.div`
    padding: 0 0 10px 0;
`

const activeButton = {
  background: '#fff',
  color: '#000'
}

const InMaket = () => {
  // ['market', 'listing', 'inventory']
  const [tab, setTab] = useState('market')
  const { isMarketAdmin } = useContract();

  return [
    <ButtonBar key={"bar"}>
      <button onClick={() => setTab('market')} style={tab === 'market' ? activeButton : {}}>Market</button>
      <button onClick={() => setTab('listing')} style={tab === 'listing' ? activeButton : {}}>Listing</button>
      <button onClick={() => setTab('inventory')} style={tab === 'inventory' ? activeButton : {}}>Inventory</button>
      <button onClick={() => setTab('offer')} style={tab === 'offer' ? activeButton : {}}>Offers</button>
      <button onClick={() => setTab('myOffer')} style={tab === 'myOffer' ? activeButton : {}}>My Offers</button>
      {isMarketAdmin ?
        <button onClick={() => setTab('admin')} style={tab === 'admin' ? activeButton : {}}>Admin</button> : ""}
    </ButtonBar>,
    <MainDiv key={"main"}>
      {
        tab === 'market' ? <ListingPane mine={false}/> :
          tab === 'listing' ? <ListingPane mine={true}/> :
            tab === 'inventory' ? <InventoryPane/> :
              tab === 'offer' ? <OfferPane mine={false}/> :
                tab === 'myOffer' ? <OfferPane mine={true}/> :
                  <AdminPanel/>
      }
    </MainDiv>];
}

export function Main() {
  const {isInMarket} = useContract();

  const notInMarket = <MainDiv>
    { isGameAdmin ?
      <AdminPanel selected={true}/> :
      `Market not open in this lobby, please contract the lobby creator to enable the market.`}
  </MainDiv>;

  return <div>
    {isInMarket === undefined ? <Loading /> : isInMarket ? <InMaket/> : notInMarket}
    <FooterPane/>
  </div>;
}
