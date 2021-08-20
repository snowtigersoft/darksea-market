import { h } from "preact";

const styles = {
  enabled: {},
  disabled: {
    backgroundColor: "#a0a0a0",
    color: "#080808",
    border: "1px solid #080808",
    outline: "none",
  },
};


function calcBonus(bonus) {
    return bonus - 100
}

export const Multiplier = ({ bonus }) => {
    let diff = calcBonus(bonus);
    let style = {
        marginLeft: '5px',
        marginRight: '10px',
        color: diff < 0 && diff > -101 ? 'red' : diff > 0 ? 'green' : 'rgb(131, 131, 131)',
        minWidth: '32px',
    };
    let text = diff === -101 ? '-' : diff < 0 ? `${diff}%` : `+${diff}%`
    return (<span style={style}>{text}</span>)
}