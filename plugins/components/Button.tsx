import { buttonStyle } from "../helpers/styles";
import React, { FunctionComponent } from 'react';
import {Btn} from "./Btn";

type Props = {
    processing: boolean;
    onClick: () => void;
    on: string;
    off: string;
};

export const Button: FunctionComponent<Props> = ({ processing, onClick, on, off }) => {
    return <Btn style={buttonStyle(processing)} onClick={onClick} disabled={processing}>
        {processing ? on : off}
    </Btn>;
};
