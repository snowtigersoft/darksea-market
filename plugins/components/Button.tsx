import { h, FunctionComponent } from "preact";

type Props = {
    processing: boolean;
    onClick: () => void;
    on: string;
    off: string;
};

export const Button: FunctionComponent<Props> = ({ processing, onClick, on, off }) => {
  let style = {
    marginLeft: '5px',
    opacity: processing ? '0.5' : '1',
};

return <button style={style} onClick={onClick} disabled={processing}>
        {processing ? on : off}
    </button>;
};
