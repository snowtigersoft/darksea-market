import { buttonStyle } from "../helpers/styles";
import React, { FunctionComponent } from 'react';

type Props = {
    processing: boolean;
    onClick: () => void;
    on: string;
    off: string;
};

export const Button: FunctionComponent<Props> = ({ processing, onClick, on, off }) => {
    return <button style={buttonStyle(processing)} onClick={onClick} disabled={processing}>
        {processing ? on : off}
    </button>;
};
