import React from "react";
import ReactDom from "react-dom";
import { App } from "./views/App";
import { getMarketContract } from "./helpers/helpers";

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

            //@ts-expect-error
            this.root = ReactDom.render(<App market={market} />, container);
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