import React, { useState } from 'react';
import _ from 'lodash';
import { Btn } from "./Btn";
import { callAction, getRandomActionId } from "../helpers/helpers";
import { BigNumber } from "ethers";
import { useContract } from "../helpers/AppHooks";
import { TOKENS_CONTRACT_ADDRESS, notifyManager } from "../contants";

export function CancelOffer({offer}) {
  const { market } = useContract();
  const [processing, setProcessing] = useState(false);
  const [show, setShow] = useState(true);

  function cancel() {
    if (!processing) {
      setProcessing(true);
      let action = {
          actionId: getRandomActionId(),
          methodName: 'cancelOffer',
      };
      callAction(market, action,
          [TOKENS_CONTRACT_ADDRESS,
              BigNumber.from(offer.offerId)
          ]).then(() => {
              setShow(false);
          }).catch((err) => {
              console.error(err);
              notifyManager.unsubmittedTxFail(action, err);
          }).finally(() => {
              setProcessing(false);
          });
    }
  }

  return (<Btn disabled={processing || !show} onClick={cancel}>{processing ? 'Waiting': 'Cancel'}</Btn>);
}