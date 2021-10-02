export const MARKET_CONTRACT_ADDRESS = "0x4F3Dce4014f804c313d9c28B513C99e40316Bd11";
export const MARKET_CONTRACT_ABI = 'https://df.snowtigersoft.com/darksea_market/06r4/abi.json';
export const TOKENS_CONTRACT_ADDRESS = "0x8e7Fc9c67Cf2bc5D001682d17355dc5c7f41e4C1";
export const TOKENS_APPROVAL_ABI = [
    {
        type: "function",
        stateMutability: "nonpayable",
        outputs: [],
        name: "setApprovalForAll",
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" },
        ],
    },
    {
        type: "function",
        stateMutability: "view",
        payable: false,
        outputs: [{ type: "bool", name: "", internalType: "bool" }],
        name: "isApprovedForAll",
        inputs: [
            { type: "address", name: "owner", internalType: "address" },
            { type: "address", name: "operator", internalType: "address" },
        ],
        constant: true,
    },
];

export const REFRESH_INTERVAL = 20000;

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
//@ts-expect-error
export const own = df.getAccount();
//@ts-expect-error
export const notifyManager = df.getNotificationsManager();