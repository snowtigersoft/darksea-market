import { listStyle, table, textCenter } from "../helpers/styles";
import React, { useState } from "react";
import { sortByKey } from "../helpers/helpers";
import { utils } from "ethers";
import styled from 'styled-components';
import { ArtifactRarityTypeLabelAnim, ArtifactRarityLabelAnim } from "../components/labels/ArtifactLabels";
import { Btn } from "../components/Btn";
import { OfferDetail } from "../components/OfferDetail";
import { own } from "../contants";
import { Loading } from "../components/Loading";
import { SortableOfferHeader } from "../components/SortableOfferHeader";
import { CreateOffer } from "../components/CreateOffer";
import { Beware } from "../components/Beware";
import { CancelOffer } from "../components/CancelOffer"
import { useContract, useOfferArtifacts } from "../helpers/AppHooks";

const PriceCell = styled.div`
  text-align: right;
  padding-right: 5px;
`;

const centerTable = {
    ...table,
    textAlign: 'center',
};

const defaultSort = [{ key: 'rarity', d: -1 }, {key: 'price', d: -1}];

export function OfferPane({ mine }) {
  const [active, setActive] = useState(undefined);
  const [sort, setSort] = useState(defaultSort);
  const { market } = useContract();
  const { offerArtifacts, loading } = useOfferArtifacts(market, 60000);
  const offers = offerArtifacts.value || [];

  const offerChildren = offers.filter((offer) => {
    return (offer.buyer.toLowerCase() === own && mine) || !mine
  }).sort(sortByKey(sort)).map(offer => {
    const act = active && active.offerId.eq(offer.offerId);
    const rows = [
      <tr key={offer.offerId.toString()} style={centerTable}>
        <td><ArtifactRarityTypeLabelAnim artifact={offer} isOffer={true} /></td>
        <td><ArtifactRarityLabelAnim artifact={offer} /></td>
        <td>{offer.qty.toString()}</td>
        <td>{offer.deal.toString()}</td>
        <td><PriceCell>{utils.formatEther(offer.price)}</PriceCell></td>
        <td>
            {offer.buyer.toLowerCase() === own ? 
            <CancelOffer offer={offer} /> : 
            act ?
            <Btn onClick={() => setActive(false)}>Close</Btn> : 
            <Btn onClick={() => setActive(offer)}>View</Btn>}
        </td>
      </tr>];
    if (act) {
      rows.push(<tr key={offer.offerId.toString() + "a"}>
        <td colSpan="6">
          <OfferDetail offer={offer} />
        </td>
      </tr>)
    }
    return rows;
  });

  return (
    <div style={listStyle}>
        {!mine ? <Beware /> : ""}
      {loading ? <Loading /> :
        offerChildren.length ?
          <table style={table}>
            <SortableOfferHeader sort={sort} setSort={setSort} defaultSort={defaultSort} />
            <tbody>
              {offerChildren}
            </tbody>
          </table> : <div style={textCenter}>No offer right now.</div>}
      {mine ? <CreateOffer /> : ""}
    </div>
  );
}