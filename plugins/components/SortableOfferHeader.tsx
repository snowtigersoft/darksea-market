import dfstyles from "../helpers/dfstyles";
import React from "react";
import styled from "styled-components";

const SortableSpan = styled.span`
    cursor: pointer;
`;

export function SortableOfferHeader({ sort, setSort, defaultSort }) {
    function sortCol(key) {
        return () => {
            if (sort[0].key === key) {
                if (sort[0].d == 1) {
                    setSort([{ key: key, d: -1 }]);
                } else {
                    setSort(defaultSort);
                }
            } else {
                setSort([{ key: key, d: 1 }]);
            }
        };
    }

    function calcColor(key) {
        if (sort[0].key == key) {
            return sort[0].d < 0 ? dfstyles.colors.dfred : dfstyles.colors.dfgreen;
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
                <th width={120}>
                    <SortableSpan onClick={sortCol(`rarity`)}>
                        <font color={calcColor('rarity')}>Rarity</font>
                    </SortableSpan>
                </th>
                <th width={60}>
                    <SortableSpan onClick={sortCol(`qty`)}>
                        <font color={calcColor('qty')}>Qty.</font>
                    </SortableSpan>
                </th>
                <th width={60}>
                    <SortableSpan onClick={sortCol(`deal`)}>
                        <font color={calcColor('deal')}>Filled</font>
                    </SortableSpan>
                </th>
                <th style={{ minWidth: "60px" }}>
                    <SortableSpan onClick={sortCol('price')}>
                        <font color={calcColor('price')}>Price</font>
                    </SortableSpan>
                </th>
                <th style={{ width: "80px" }}></th>
            </tr>
        </thead>
    );
}