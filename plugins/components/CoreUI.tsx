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

export const Select = styled.select`
  ${({ wide }: { wide?: boolean }) => css`
    outline: none;
    background: ${dfstyles.colors.background};
    color: ${dfstyles.colors.subtext};
    border-radius: 4px;
    border: 1px solid ${dfstyles.colors.border};
    width: ${wide ? '100%' : '12em'};
    padding: 2px 6px;
    cursor: pointer;
    &:hover {
      border: 1px solid ${dfstyles.colors.subtext};
      background: ${dfstyles.colors.subtext};
      color: ${dfstyles.colors.background};
    }
  `}
`;