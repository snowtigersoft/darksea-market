import { MARKET_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI, TOKENS_CONTRACT_ADDRESS, TOKENS_APPROVAL_ABI, notifyManager, own } from "../contants";
import { BigNumber, utils } from "ethers";
import { _ } from "lodash";
import { Upgrade } from "@darkforest_eth/types";

export async function getMarketContract() {
    //@ts-expect-error
    return df.loadContract(MARKET_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI);
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
    notifyManager.notify(100, `[DarkSeaMarket] ${msg}`);
}

export function getRandomActionId() {
    const hex = '0123456789abcdef';

    let ret = '';
    for (let i = 0; i < 10; i += 1) {
        ret += hex[Math.floor(hex.length * Math.random())];
    }
    return ret;
}

async function checkAndApprove() {
    return new Promise((resolve, reject) => {
        const name = `darksae-approved-${TOKENS_CONTRACT_ADDRESS}-${MARKET_CONTRACT_ADDRESS}-${own}`;
        const approve = window[name];
        if (!approve) {
            log('checking Approve', 'info');
            getTokenContract().then(async (contract) => {
                let a = await contract.isApprovedForAll(own, MARKET_CONTRACT_ADDRESS);
                let retry = 1;
                while(!a && retry <= 3) {
                    log(`call setApprove ${retry}`, 'info');
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
                log('Approved', 'info');
                resolve(true);
            }).catch((err) => {
                reject(err);
            })
        } else {
            resolve(true);
        }
    });
}
  
export async function callAction(contract, methodName, args, overrids = {
    gasPrice: undefined,
    gasLimit: 2000000
}) {
    //@ts-expect-error
    if (!df.contractsAPI.txExecutor) {
        throw (new Error('no signer, cannot execute tx'));
    }

    if (methodName === "list" || methodName === "fillOffer") {
        await checkAndApprove();
    }

    const tx = {
        methodName: methodName,
        contract: contract,
        args: args
    };

    //@ts-expect-error
    const e = await df.contractsAPI.submitTransaction(tx, overrids);
    return e.confirmedPromise
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

export function log(msg, level, ...optionalParams: any[]) {
    switch (level) {
        case "debug":
            console.debug(`[${ new Date()}][DarkDeaMarket] ${msg}`, ...optionalParams);
            break;
        case "info":
            console.info(`[${ new Date()}][DarkDeaMarket] ${msg}`, ...optionalParams);
            break;
        case "warn":
            console.warn(`[${ new Date()}][DarkDeaMarket] ${msg}`, ...optionalParams);
            break;
        case "error":
            console.error(`[${ new Date()}][DarkDeaMarket] ${msg}`, ...optionalParams);
            break;
    }
}