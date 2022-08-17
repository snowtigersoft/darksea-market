import {listStyle} from "../helpers/styles";
import React, {useState} from "react";
import styled from 'styled-components';
import {Input} from "../components/Input";
import {Btn} from "../components/Btn";
import {ButtonGroup, Separator} from "../components/CoreUI";
import {useContract, useCreatorFees} from "../helpers/AppHooks";
import {notifyManager, own, TOKENS_CONTRACT_ADDRESS} from "../contants";
import {BigNumber, utils} from "ethers";
import {callAction, getRandomActionId, log} from "../helpers/helpers";
import {Button} from "../components/Button";

const DetailWrapper = styled.div`
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

const WithdrawButton = ({enable}) => {
  if (!enable) {
    return null;
  }

  const {market} = useContract();
  const [processing, setProcessing] = useState(false);

  function withdraw() {
    if (!processing) {
      setProcessing(true);
      let methodName = 'collectCollectionFees';
      callAction(market, methodName, [TOKENS_CONTRACT_ADDRESS]).then(() => {
        setProcessing(false);
      }).catch((err) => {
        setProcessing(false);
        console.error(err);
        notifyManager.txInitError(methodName, err.message);
      });
    }
  }

  return <Button onClick={withdraw} processing={processing} on="Waiting" off="Collect Fees"/>;
}

const CollectFees = () => {
  const {fee} = useCreatorFees();

  return <div>
    <Separator />
    <Row>{`Creator Fees: ${utils.formatEther(fee)}xDai`} <WithdrawButton enable={fee > 0} /></Row>
  </div>;
}


export function AdminPanel() {
  const {market, isInMarket, creatorFee, minPrice, isMarketAdmin} = useContract();
  const [fee, setFee] = useState(creatorFee);
  const [price, setPrice] = useState(minPrice);
  const [processing, setProcessing] = useState(false);

  const save = () => {
    if (+price < 0.01) {
      alert("Min price must greater than 0.01");
      setPrice(0.01);
      return
    }
    if (!processing) {
      setProcessing(true);
      const methodName = isInMarket ? 'editByOwner' : 'addByOwner';
      const overrids = {
        gasLimit: 5000000,
        gasPrice: undefined,
      };
      callAction(market, methodName,
        [TOKENS_CONTRACT_ADDRESS,
          BigNumber.from(100 * fee),
          utils.parseEther(price.toString())
        ], overrids).catch((err) => {
        console.error(err);
        notifyManager.txInitError(methodName, err.message);
      }).finally(() => {
        setProcessing(false);
      });
    }
  }
  const changeFee = (e) => {
    const {value} = e.currentTarget;
    if (+value <= 20 && +value >= 0) {
      setFee(+value)
    }
  }
  const changePrice = (e) => {
    const {value} = e.currentTarget;
    try {
      log(utils.parseEther(value), 'info');
      setPrice(value);
    } catch (err) {
      log("Min Price not a valid Ether value.", 'error');
    }
  }
  const onKeyUp = (e) => {
    e.stopPropagation();
  }

  return (
    <div style={listStyle}>
      <div>Logged in as account: {own}</div>
      <DetailWrapper>
        <Row>
          <div className='statrow'>
            <span>Fee (%)</span>
            <span><Input placeholder="%" wide={true} type="number" value={fee} onChange={changeFee} onKeyUp={onKeyUp}
                         step={0.1}/></span>
          </div>
          <div className='statrow'>
            <span>Min Price</span>
            <span><Input placeholder="XDAI" wide={true} type="number" value={price} onChange={changePrice}
                         onKeyUp={onKeyUp} step={0.01}/></span>
          </div>
        </Row>
        <div>
          <ButtonGroup>
            <Btn className="btn" disabled={processing}
                 onClick={save}>{isInMarket ? 'Save Settings' : 'Setup Market'}</Btn>
          </ButtonGroup>
        </div>
      </DetailWrapper>
      { isMarketAdmin ? <CollectFees /> : null}
    </div>
  );
}