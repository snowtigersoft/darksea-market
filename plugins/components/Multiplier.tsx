import React from "react";
import { Green, Red, Sub } from "./Text";

function calcMult(mult) {
    return Math.round(mult - 100)
}

export const Multiplier = ({ mult }) => {
    let diff = calcMult(mult);
    let text = diff === -101 ? '-' : diff < 0 ? `${diff}%` : `+${diff}%`
    return (
      <span>
          {diff === -101 && <Sub>-</Sub>}
          {diff > 0 && <Green>{text}</Green>}
          {diff === 0 && <Sub>+0%</Sub>}
          {diff < 0 && <Red>{text}</Red>}
      </span>
    )
}