import { h, render } from "preact";

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

        container.style.width = '600px';

        try {
            const contract = await getMarketContract();
            const artifacts = await getAllArtifacts(contract);
            const initBalance = await contract.getMyBalance();
            const fee = await contract.getFee();
            const minPrice = utils.formatEther(await contract.getMinPrice());

            //@ts-expect-error
            this.root = render(<App artifacts={artifacts} initBalance={initBalance} contract={contract} fee={fee} minPrice={minPrice}/>, container);
        } catch (err) {
            console.error("[DFArtifactMarket] Error starting plugin:", err);
            render(<div>{err.message}</div>, container);
        }
    }

    destroy() {
        //@ts-expect-error
        render(null, this.container, this.root);
    }
}

export default DarkSeaMarketPlugin;