import { MARKET_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI, TOKENS_CONTRACT_ADDRESS, TOKENS_APPROVAL_ABI, notifyManager, own } from "../contants";

export async function getMarketContract() {
    const abi = await fetch(MARKET_CONTRACT_ABI).then(res=>res.json())
    //@ts-expect-error
    return df.loadContract(MARKET_CONTRACT_ADDRESS, abi);
}

export async function getTokenContract() {
    const abi = await fetch(TOKENS_APPROVAL_ABI).then(res=>res.json())
    //@ts-expect-error
    return df.loadContract(TOKENS_CONTRACT_ADDRESS, abi);
}

export async function getAllArtifacts(contract) {
    const artifacts = await contract.getAllArtifacts();
    return artifacts.filter(item=>item.status === 0);
}

export function notify(msg) {
    notifyManager.notify(1, `[ArtifactsMarket] ${msg}`);
}

export function getRandomActionId() {
    const hex = '0123456789abcdef';
  
    let ret = '';
    for (let i = 0; i < 10; i += 1) {
      ret += hex[Math.floor(hex.length * Math.random())];
    }
    return ret;
};

async function checkAndApprove() {
    return new Promise((resolve, reject) => {
        let approve = localStorage.getItem(`artifact-market-approved-${own}`);
        if (!approve || approve !== 'true') {
            console.log('[ArtifactsMarket] set Approve');
            getTokenContract().then((contract) => {
                return contract.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true)
            }).then(() => {
                localStorage.setItem(`artifact-market-approved-${own}`, 'true');
                console.log('[ArtifactsMarket] Approved');
                resolve(true);
            }).catch((err) => {
                reject(err);
            })
        } else {
            resolve(true);
        }
    });
}

export async function callAction(contract, action, args, overrids = {}) {
    //@ts-expect-error
    if (!df.contractsAPI.txExecutor) {
        throw(new Error('no signer, cannot execute tx'));
    }

    await checkAndApprove();

    let defaultTxOptions = {
        gasPrice: undefined,
        gasLimit: 2000000,
    };
    notifyManager.txInit(action);

    const submitted = contract[action.methodName](...args, {
        ...defaultTxOptions,
        ...overrids,
        //@ts-expect-error
        nonce: await df.contractsAPI.ethConnection.getNonce(),
    });

    const txa = {
        ...action,
        txHash: (await submitted).hash,
        sentAtTimestamp: Math.floor(Date.now() / 1000),
    };

    //@ts-expect-error
    const confirmed = df.contractsAPI.ethConnection.waitForTransaction(txa.txHash);

    //@ts-expect-error
    return df.contractsAPI.waitFor(txa, confirmed);
}

export function getLocalArtifact(artifactId) {
    const name = `artifact-market-${artifactId}`;
    let artifact = localStorage.getItem(name);
    if (artifact) {
        artifact = JSON.parse(artifact);
    }
    return artifact;
}

export function setLocalArtifact(artifact) {
    const name = `artifact-market-${artifact.id}`;
    localStorage.setItem(name, JSON.stringify(artifact));
}