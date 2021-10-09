import { MARKET_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI, TOKENS_CONTRACT_ADDRESS, TOKENS_APPROVAL_ABI, notifyManager, own } from "../contants";
import { BigNumber, utils } from "ethers";
import { _ } from "lodash";
import { Upgrade } from "@darkforest_eth/types";

export async function getMarketContract() {
    const abi = await fetch(MARKET_CONTRACT_ABI).then(res => res.json())
    //@ts-expect-error
    return df.loadContract(MARKET_CONTRACT_ADDRESS, abi);
}

export async function getTokenContract() {
    //@ts-expect-error
    return df.loadContract(TOKENS_CONTRACT_ADDRESS, TOKENS_APPROVAL_ABI);
}

export async function getAllArtifacts(contract) {
    const artifacts = await contract.getAllItems(TOKENS_CONTRACT_ADDRESS);
    return artifacts.filter(item => item.status === 0);
}

export async function getAllOffers(contract) {
    const offers = await contract.getAllOffers(TOKENS_CONTRACT_ADDRESS);
    return offers.filter(item => item.status === 0);
}

export function notify(msg) {
    notifyManager.notify(1, `[DarkSeaMarket] ${msg}`);
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
        const name = `darksae-approved-${TOKENS_CONTRACT_ADDRESS}-${MARKET_CONTRACT_ADDRESS}-${own}`;
        const approve = window[name];
        if (!approve) {
            console.log('[DarkSeaMarket] checking Approve');
            getTokenContract().then(async (contract) => {
                let a = await contract.isApprovedForAll(own, MARKET_CONTRACT_ADDRESS);
                let retry = 1;
                while(!a && retry <= 3) {
                    console.log(`[DarkSeaMarket] call setApprove ${retry}`);
                    await contract.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true);
                    a = await contract.isApprovedForAll(own, MARKET_CONTRACT_ADDRESS);
                    retry++;
                }
                if (!a) {
                    alert("[DarkSeaMarket] Set Approve Failed, please refresh the page.");
                    reject(new Error("[DarkSeaMarket] call setApprove failed."));
                } else {
                    return a;
                }
            }).then(() => {
                window[name] = true;
                console.log('[DarkSeaMarket] Approved');
                resolve(true);
            }).catch((err) => {
                reject(err);
            })
        } else {
            resolve(true);
        }
    });
}

function gweiToWei(gwei: number): BigNumber {
    return utils.parseUnits(gwei + '', 'gwei');
}
  
export async function callAction(contract, action, args, overrids = {
    gasPrice: undefined,
    gasLimit: 2000000
}) {
    //@ts-expect-error
    if (!df.contractsAPI.txExecutor) {
        throw (new Error('no signer, cannot execute tx'));
    }

    if (action.methodName === "list" || action.methodName === "fillOffer") {
        await checkAndApprove();
    }

    if (overrids.gasPrice === undefined) {
        //@ts-expect-error
        const ethConnection = df.contractsAPI.ethConnection;
        overrids.gasPrice = gweiToWei(
            ethConnection.getAutoGasPriceGwei(
                ethConnection.getAutoGasPrices(),
                //@ts-expect-error
                df.contractsAPI.txExecutor.gasSettingProvider(action)
            )
        );
    }
    notifyManager.txInit(action);

    const submitted = contract[action.methodName](...args, {
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

export const getUpgradeStat = (upgrade: Upgrade, stat: number): number => {
    if (stat === 0) return upgrade.energyCapMultiplier;
    else if (stat === 1) return upgrade.energyGroMultiplier;
    else if (stat === 2) return upgrade.rangeMultiplier;
    else if (stat === 3) return upgrade.speedMultiplier;
    else if (stat === 4) return upgrade.defMultiplier;
    else return upgrade.energyCapMultiplier;
};

export function sortByKey(sorts) {
    function doSort(n1, n2) {
        let ret = 0;
        for (let i=0; i<sorts.length; i++) {
            let {key, d} = sorts[i];
            let a, b;
            if (key.startsWith('upgrade.') > 0) {
                a = getUpgradeStat(n1.upgrade, +key.substr(8));
                b = getUpgradeStat(n2.upgrade, +key.substr(8));
            } else {
                a = n1[key], b = n2[key];
            }
            if (typeof(a) === 'object') {
                a = +utils.formatEther(a);
                b = +utils.formatEther(b);
            }
            let ret = (a < b ? -1 : a > b ? 1 : 0) * d;
            if (ret != 0) {
                return ret;
            }
        }
        return ret;
    }
    return doSort;
}