import { listStyle } from "../helpers/styles";
import { Button } from "../components/Button";
import { getRandomActionId, callAction } from "../helpers/helpers";
import { useState } from "preact/hooks";
import { notifyManager } from "../contants";
import { h } from "preact";

function WithdrawButton(contract) {
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
                console.log(err);
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
            <div>Balance: {balance} {balance > 0? <WithdrawButton contract={contract}/>:''}</div>
        </div>;
}
