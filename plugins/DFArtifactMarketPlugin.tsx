import { h, render } from "preact";

import { App } from "./views/App";
import { getMarketContract, getAllArtifacts } from "./helpers/helpers";

class DFArtifactMarketPlugin {
    constructor() {
        this.root = null;
        this.container = null
    }

    async render(container) {
        this.container = container;

        container.style.width = '600px';

        try {
            const contract = await getMarketContract();
            const artifacts = await getAllArtifacts(contract);
            const initBalance = await contract.getMyBalance();
            const fee = await contract.fee();

            this.root = render(<App artifacts={artifacts} initBalance={initBalance} contract={contract} fee={fee}/>, container);
        } catch (err) {
            console.error("[DFArtifactMarket] Error starting plugin:", err);
            render(<div>{err.message}</div>, this.container);
        }
    }

    destroy() {
        render(null, this.container, this.root);
    }
}

export default DFArtifactMarketPlugin;