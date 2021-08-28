import styled, { css } from 'styled-components';
import dfstyles from '../helpers/dfstyles';

export const InlineBlock = styled.div`
  display: inline-block;
`;

export const Separator = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding-left: 2px;
  padding-right: 2px;
  height: 1px;
  background-color: ${dfstyles.colors.borderDark};
`;

export const FloatRight = styled.div`
  float: right;
`;

export const Spacer = styled.div`
  ${({ width, height }: { width?: number; height?: number }) => css`
    width: 1px;
    height: 1px;
    ${width && !height ? 'display: inline-block;' : ''}
    ${width ? `width: ${width}px;` : ''}
    ${height ? `height: ${height}px;min-height:${height}px;` : ''}
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1em;
  .btn {
      flex-grow: 1;
      margin: 0 1em;
  }
`;