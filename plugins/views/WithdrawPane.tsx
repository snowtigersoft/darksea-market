import { listStyle } from "../helpers/styles";
import { Button } from "../components/Button";
import { getRandomActionId, callAction } from "../helpers/helpers";
import { useState } from "preact/hooks";
import { notifyManager } from "../contants";
import { h } from "preact";

export function WithdrawButton({contract, disabled}) {
    if (disabled) {
        return;
    }

    let [processing, setProcessing] = useState(false);

    function withdraw() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'withdraw',
            };
            callAction(contract, action, []).then(()=>{
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.error(err);
                notifyManager.unsubmittedTxFail(action, err);
            });
        }
    }

    return <Button onClick={withdraw} processing={processing} on="Waiting" off="Withdraw"/>;
}

export function WithdrawPane({selected, balance, contract, fee}) {
    if (!selected) {
        return
    }

    return <div style={listStyle}>
            <div>Fee: ${fee} %</div>
            <div>Balance: {balance} <WithdrawButton contract={contract} disabled={balance == 0}/></div>
        </div>;
}
