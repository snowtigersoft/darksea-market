export const MARKET_CONTRACT_ADDRESS = "0x9395c3b2Bc93ce7E910cbfd7f5B484ca410d85d3";
export const MARKET_CONTRACT_ABI = 'https://df.snowtigersoft.com/darksae_market/06r3/abi.json';
export const TOKENS_CONTRACT_ADDRESS = "0x621ce133521c3B1cf11C0b9423406F01835af0ee";
export const TOKENS_APPROVAL_ABI = 'https://gist.githubusercontent.com/snowtigersoft/763b0ad6c274fb4b965d9989d8efbc62/raw/7a8bdab1c538459203e12c62871fd4e1390c281d/approval_abi.json';  

export const REFRESH_INTERVAL = 60;

//@ts-expect-error
export const own = df.getAccount();
//@ts-expect-error
export const notifyManager = df.getNotificationsManager();