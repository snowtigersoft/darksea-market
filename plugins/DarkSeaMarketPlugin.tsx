import React from "react";
import ReactDom from "react-dom";
import { TOKENS_CONTRACT_ADDRESS } from "./contants";
import { App } from "./views/App";
import { utils } from "ethers";
import { getMarketContract, getAllArtifacts } from "./helpers/helpers";

class DarkSeaMarketPlugin {
    constructor() {
        //@ts-expect-error
        this.root = null;
        //@ts-expect-error
        this.container = null
    }

    async render(container) {
        //@ts-expect-error
        this.container = container;

        container.style.width = '550px';

        try {
            const market = await getMarketContract();
            const baseFee = await market.getFee();
            const collFee = await market.getCollectionFee(TOKENS_CONTRACT_ADDRESS);
            const contract = {
                market: market,
                fee: (parseInt(baseFee, 10) + parseInt(collFee, 10)) / 100,
                minPrice: utils.formatEther(await market.getCollectionMinPrice(TOKENS_CONTRACT_ADDRESS))
            };

            //@ts-expect-error
            this.root = ReactDom.render(<App contract={contract} />, container);
        } catch (err) {
            console.error("[DarkSeaMarket] Error starting plugin:", err);
            ReactDom.render(<div>{err.message}</div>, container);
        }
    }

    destroy() {
        //@ts-expect-error
        ReactDom.render(null, this.container, this.root);
    }
}

export default DarkSeaMarketPlugin;