import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Btn } from "./Btn";
import { ButtonGroup, Select } from "./CoreUI";
import { Input } from "./Input";
import { callAction, getRandomActionId } from "../helpers/helpers";
import { utils, BigNumber } from "ethers";
import { useContract } from "../helpers/AppHooks";
import { TOKENS_CONTRACT_ADDRESS, notifyManager } from "../contants";
import { ArtifactRarity, ArtifactRarityNames, ArtifactType, ArtifactTypeNames } from "@darkforest_eth/types";

const OfferDetailWrapper = styled.div`
  min-height: 128px;
  padding: 1em;
  background: #001;
  display: block;
  flex-direction: row;
  & > div::last-child {
    flex-grow: 1;
  }
  .statrow {
    display: flex;
    width: 50%;
    margin: 0 1em;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & > span:first-child {
      margin-right: 1.5em;
    }
    & > span:last-child {
      text-align: right;
      width: 3em;
      flex-grow: 1;
    }
  }
`;

const Row = styled.div`
  display: flex;
  padding: 5px;
`

const Center = styled.div`
  text-align: center;
  margin: 1em;
`

const Price  = styled.div`
  font-size: 2em;
  font-weight: bold;
  text-align: center;
`;

const artifactTypes = _.range(ArtifactType.BlackDomain + 1).map(i => {
  return <option value={i} key={i}>{i > 0 ? ArtifactTypeNames[i] : "Any Type"}</option>
});

const rarities = _.range(1, ArtifactRarity.Mythic + 1).map(i => {
  return <option value={i} key={i}>{ArtifactRarityNames[i]}</option>
})

export function CreateOffer() {
  const { market } = useContract();
  const [active, setActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("1");
  const [rarity, setRarity] = useState(ArtifactRarity.Mythic);
  const [artifactType, setArtifactType] = useState(ArtifactType.Unknown);

  function change(e) {
    const { value } = e.currentTarget;
    try {
      utils.parseEther(value);
      setPrice(value);
    } catch (err) {
      console.error("[DarkSeaMarket] Price not a valid Ether value.");
    }
  }

  function changeQty(e) {
    const { value } = e.currentTarget;
    try {
      setQty(value);
    } catch (err) {
      console.error("[DarkSeaMarket] Qty not a valid int.");
    }
  }

  function create() {
    if (!processing) {
      setProcessing(true);
      let methodName = 'placeOffer';
      const overrids = {
        value: BigNumber.from(utils.parseEther((+price * +qty).toString())).toString(),
        gasLimit: 5000000,
        gasPrice: undefined,
      };
      callAction(market, methodName,
        [TOKENS_CONTRACT_ADDRESS,
          utils.parseEther(price.toString()),
          BigNumber.from(qty),
          rarity,
          artifactType
        ], overrids).then(() => {
          setPrice("");
          setQty("1");
          setActive(false);
        }).catch((err) => {
          console.error(err);
          notifyManager.txInitError(methodName, err.message);
        }).finally(() => {
          setProcessing(false);
        });
    }
  }

  function onKeyUp(e) {
    e.stopPropagation();
  }

  return (
    active ?
      <OfferDetailWrapper>
        <Row>
          <div className='statrow'>
            <span>Type</span>
            <span>
              <Select wide={true} value={artifactType} onChange={(e) => setArtifactType(e.target.value)}>
                {artifactTypes}
              </Select>
            </span>
          </div>
          <div className='statrow'>
            <span>Rarity</span>
            <span>
              <Select wide={true} value={rarity} onChange={(e) => setRarity(e.target.value)}>
                {rarities}
              </Select>
            </span>
          </div>
        </Row>
        <Row>
          <div className='statrow'>
            <span>Price</span>
            <span><Input placeholder="XDAI" wide={true} type="number" value={price} onChange={change} onKeyUp={onKeyUp} step={0.01} /></span>
          </div>
          <div className='statrow'>
            <span>Qty.</span>
            <span><Input wide={true} type="number" value={qty} onChange={changeQty} onKeyUp={onKeyUp} step={1} /></span>
          </div>
        </Row>
        <div>
          <Center>
            Amount: <Price>{utils.formatEther(utils.parseEther((+price * +qty).toString()))} xDai</Price>
          </Center>
        </div>
        <div>
          <ButtonGroup>
            <Btn className="btn" disabled={processing} onClick={create}>{processing ? 'Waiting' : 'Create'}</Btn>
            <Btn onClick={() => setActive(false)} className="btn">Cancel</Btn>
          </ButtonGroup>
        </div>
      </OfferDetailWrapper> :
      <Center><Btn onClick={() => setActive(true)}>Create New Offer</Btn></Center>
  );
}