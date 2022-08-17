//@ts-expect-error
export const MARKET_CONTRACT_ADDRESS = df.ethConnection.getProvider().network.chainId == 300 ? "0x06187833f809E41511A68276369B72C480adA113" : "0x4F3Dce4014f804c313d9c28B513C99e40316Bd11";
//@ts-expect-error
export const TOKENS_CONTRACT_ADDRESS : string = df.contractsAPI.contractAddress || "0x621ce133521c3B1cf11C0b9423406F01835af0ee";
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
//@ts-expect-error
export const isGameAdmin = own.toLowerCase() === df.contractConstants.adminAddress.toLowerCase();
const officialRound = [
    "0x8e7Fc9c67Cf2bc5D001682d17355dc5c7f41e4C1",
    "0x5da117b8aB8b739346F5EdC166789E5aFb1a7145"
];
export const isOfficialRound = officialRound.indexOf(TOKENS_CONTRACT_ADDRESS) > -1;

export const MARKET_CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "AddCollection",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "Bought",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "CancelOffer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "CollectionFeeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "CollectionOwnerChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "EditCollection",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "FeeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "FillOffer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "Listed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "MinPriceChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "PlacedOffer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "transferFee",
          "type": "uint256"
        }
      ],
      "name": "TransferFeeChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "Unlisted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "addByOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "addCollection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startIdx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endIdx",
          "type": "uint256"
        }
      ],
      "name": "bulkGetItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "startIdx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endIdx",
          "type": "uint256"
        }
      ],
      "name": "bulkGetOffers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "buy",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "cancelOffer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "collectCollectionFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "collectFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "editByOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "editCollection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        }
      ],
      "name": "fillOffer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllCollections",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getAllItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getAllOffers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getBalanceByAddress",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getCollectionFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getCollectionFeeBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getCollectionMinPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getCollectionOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getCollectionTotalFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFeeBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "getItem",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item",
          "name": "item",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "pageIdx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pageSize",
          "type": "uint256"
        }
      ],
      "name": "getItemPage",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getItemsByOwner",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getListingCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getMyItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "listId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "baseFee",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Item[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getMyOffers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getNItemsByOwner",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getNMyItems",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getNMyOffers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "getNOffersByBuyer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offerId",
          "type": "uint256"
        }
      ],
      "name": "getOffer",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer",
          "name": "ret",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getOfferCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "pageIdx",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pageSize",
          "type": "uint256"
        }
      ],
      "name": "getOfferPage",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        }
      ],
      "name": "getOffersByBuyer",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "offerId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "qty",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deal",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenID",
              "type": "uint256"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactRarity",
              "name": "rarity",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkForestTypes.ArtifactType",
              "name": "artifactType",
              "type": "uint8"
            },
            {
              "internalType": "enum DarkSeaMarketTypes.Status",
              "name": "status",
              "type": "uint8"
            }
          ],
          "internalType": "struct DarkSeaMarketTypes.Offer[]",
          "name": "ret",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransferFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "transferFee",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "isInMarket",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "list",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pauseMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "qty",
          "type": "uint256"
        },
        {
          "internalType": "enum DarkForestTypes.ArtifactRarity",
          "name": "rarity",
          "type": "uint8"
        },
        {
          "internalType": "enum DarkForestTypes.ArtifactType",
          "name": "artifactType",
          "type": "uint8"
        }
      ],
      "name": "placeOffer",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "sendFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "fee",
          "type": "uint256"
        }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "minPrice",
          "type": "uint256"
        }
      ],
      "name": "setMinPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "transferFee",
          "type": "uint256"
        }
      ],
      "name": "setTransferFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferCollectionOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "listId",
          "type": "uint256"
        }
      ],
      "name": "unlist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpauseMarket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];