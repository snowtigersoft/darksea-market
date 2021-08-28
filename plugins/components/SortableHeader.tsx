import {
    PriceIcon,
    StatIcon,
} from '../components/Icon';
import dfstyles from "../helpers/dfstyles";
import React from "react";
import { _ } from "lodash";
import styled from "styled-components";

const SortableSpan = styled.span`
    cursor: pointer;
`;

export function SortableHeader({sort, setSort, defaultSort, withPrice}) {
    function sortCol(key) {
        return () => {
            if (sort[0].key === key) {
                if (sort[0].d == 1) {
                    setSort([{key: key, d: -1}]);
                } else {
                    setSort(defaultSort);
                }
            } else {
                setSort([{key: key, d: 1}]);
            }
        };
    }

    function calcColor(key) {
        if (sort[0].key == key) {
            return sort[0].d < 0 ? dfstyles.colors.dfred: dfstyles.colors.dfgreen;
        }
        return dfstyles.colors.text;
    }

    return (
        <thead>
            <tr>
                <th>
                    <SortableSpan onClick={sortCol('artifactType')}>
                        <font color={calcColor('artifactType')}>Type</font>
                    </SortableSpan>
                </th>
                {_.range(0, 5).map((val) => (
                    <th width={withPrice?52:60} key={val}>
                        <SortableSpan onClick={sortCol(`upgrade.${val}`)}>
                            <StatIcon stat={val} color={calcColor(`upgrade.${val}`)} />
                        </SortableSpan>
                    </th>
                ))}
                {withPrice ? 
                <th style={{minWidth: "60px"}}>
                    <SortableSpan onClick={sortCol('price')}>
                        <PriceIcon color={calcColor('price')}/>
                    </SortableSpan>
                </th> : null
                }
                <th style={{width: "60px"}}></th>
            </tr>
        </thead>
    );
}