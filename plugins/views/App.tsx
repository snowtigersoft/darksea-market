import React from "react";
import { useInfo } from "../helpers/AppHooks";
import { ContractProvider } from "../helpers/ContractContext";
import { Main } from "./Main";
import {log} from "../helpers/helpers";


export function App({ market }) {
    log("Starting", 'info');
    const { fee, creatorFee, minPrice, isInMarket, isMarketAdmin } = useInfo(market);
    const contract = {
        market,
        fee,
        creatorFee,
        minPrice,
        isInMarket,
        isMarketAdmin
    };

    return (
        <ContractProvider value={contract}>
            <Main/>
        </ContractProvider>
    );
}
