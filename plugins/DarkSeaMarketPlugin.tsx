import React from "react";
import ReactDom from "react-dom";
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
            const contract = {
                market: await getMarketContract(),
                fee: await market.getFee(),
                minPrice: utils.formatEther(await market.getMinPrice())
            };

            //@ts-expect-error
            this.root = ReactDom.render(<App contract={contract} />, container);
        } catch (err) {
            console.error("[DFArtifactMarket] Error starting plugin:", err);
            ReactDom.render(<div>{err.message}</div>, container);
        }
    }

    destroy() {
        //@ts-expect-error
        ReactDom.render(null, this.container, this.root);
    }
}

export default DarkSeaMarketPlugin;