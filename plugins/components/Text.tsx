import styled, { css } from 'styled-components';
import dfstyles from '../helpers/dfstyles';

export const Green = styled.span`
  color: ${dfstyles.colors.dfgreen};
`;
export const Sub = styled.span`
  color: ${dfstyles.colors.subtext};
`;
export const Subber = styled.span`
  color: ${dfstyles.colors.subbertext};
`;
export const Text = styled.span`
  color: ${dfstyles.colors.text};
`;
export const Red = styled.span`
  color: ${dfstyles.colors.dfred};
`;
export const Gold = styled.span`
  color: ${dfstyles.colors.dfyellow};
`;

export const Colored = styled.span<{ color: string }>`
  color: ${({ color }) => color};
`;

export const Blue = styled.span`
  color: ${dfstyles.colors.dfblue};
`;

export const Invisible = styled.span`
  color: rgba(0, 0, 0, 0);
`;

export const Smaller = styled.span`
  font-size: 80%;
`;