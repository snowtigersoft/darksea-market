export const MARKET_CONTRACT_ADDRESS = "0x9395c3b2Bc93ce7E910cbfd7f5B484ca410d85d3";
export const MARKET_CONTRACT_ABI = 'https://df.snowtigersoft.com/darksea_market/06r3/abi.json';
export const TOKENS_CONTRACT_ADDRESS = "0x621ce133521c3B1cf11C0b9423406F01835af0ee";
export const TOKENS_APPROVAL_ABI = "https://gist.githubusercontent.com/olegabr/45d659bec5f068eb9d82af4d3f712a23/raw/f0fb736104a448d5fefe3412cb71bc6305c1317f/ERC721-ABI.json";

export const REFRESH_INTERVAL = 60 * 1000;

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
//@ts-expect-error
export const own = df.getAccount();
//@ts-expect-error
export const notifyManager = df.getNotificationsManager();