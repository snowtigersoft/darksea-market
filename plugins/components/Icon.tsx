import React from 'react';
import styled from 'styled-components';
import dfstyles from '../helpers/dfstyles';

const SVGWrapper = styled.span`
  width: 1em;
  height: 1em;
  display: inline-block;
  position: relative;
  & svg {
    width: 100%;
    height: 100%;
    & path {
      fill: ${dfstyles.colors.text};
    }
  }
  & img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

const DefaultSVG = ({
    children,
    width,
    height,
}: {
    children: React.ReactNode;
    width?: number;
    height?: number;
}) => {
    return (
        <svg
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            width='512'
            height='512'
            viewBox={`0 0 ${height || 512} ${width || 512}`}
        >
            {children}
        </svg>
    );
};


const SpeedSVG = ({ color }: { color?: string }) => {
    return (
        <DefaultSVG>
            <path
                style={{ fill: color || dfstyles.colors.text }}
                d='M256 432v-160l-160 160v-352l160 160v-160l176 176z'
            ></path>
        </DefaultSVG>
    );
};

export const SpeedIcon = ({ color }: { color?: string }) => {
    return (
        <SVGWrapper>
            <SpeedSVG color={color} />
        </SVGWrapper>
    );
};

const DefenseSVG = ({ color }: { color?: string }) => {
    return (
        <DefaultSVG>
            <path
                style={{ fill: color || dfstyles.colors.text }}
                d='M256.002 52.45l143.999 78.545-0.001 109.005c0 30.499-3.754 57.092-11.477 81.299-7.434 23.303-18.396 43.816-33.511 62.711-22.371 27.964-53.256 51.74-99.011 76.004-45.753-24.263-76.644-48.042-99.013-76.004-15.116-18.896-26.078-39.408-33.512-62.711-7.722-24.207-11.476-50.8-11.476-81.299v-109.004l144.002-78.546zM256.003 0c-2.637 0-5.274 0.651-7.663 1.954l-176.002 96c-5.14 2.803-8.338 8.191-8.338 14.046v128c0 70.394 18.156 127.308 55.506 173.995 29.182 36.478 69.072 66.183 129.34 96.315 2.252 1.126 4.704 1.689 7.155 1.689s4.903-0.563 7.155-1.689c60.267-30.134 100.155-59.839 129.337-96.315 37.351-46.687 55.507-103.601 55.507-173.995l0.001-128c0-5.855-3.198-11.243-8.338-14.046l-175.999-96c-2.387-1.303-5.024-1.954-7.661-1.954v0z'
            ></path>
            <path
                style={{ fill: color || dfstyles.colors.text }}
                d='M160 159.491v80.509c0 25.472 3.011 47.293 9.206 66.711 5.618 17.608 13.882 33.085 25.265 47.313 14.589 18.237 34.038 34.408 61.531 50.927 27.492-16.518 46.939-32.688 61.53-50.927 11.382-14.228 19.646-29.704 25.263-47.313 6.194-19.418 9.205-41.239 9.205-66.711l0.001-80.51-95.999-52.363-96.002 52.364z'
            ></path>
        </DefaultSVG>
    );
};

export const DefenseIcon = ({ color }: { color?: string }) => {
    return (
        <SVGWrapper>
            <DefenseSVG color={color} />
        </SVGWrapper>
    );
};

const RangeSVG = ({ color }: { color?: string }) => (
    <DefaultSVG>
        <path
            style={{ fill: color || dfstyles.colors.text }}
            d='M118.627 438.627l265.373-265.372v114.745c0 17.673 14.327 32 32 32s32-14.327 32-32v-192c0-12.942-7.797-24.611-19.754-29.563-3.962-1.642-8.121-2.42-12.246-2.419v-0.018h-192c-17.673 0-32 14.327-32 32 0 17.674 14.327 32 32 32h114.745l-265.372 265.373c-6.249 6.248-9.373 14.438-9.373 22.627s3.124 16.379 9.373 22.627c12.496 12.497 32.758 12.497 45.254 0z'
        ></path>
    </DefaultSVG>
);

export const RangeIcon = ({ color }: { color?: string }) => (
    <SVGWrapper>
        <RangeSVG color={color} />
    </SVGWrapper>
);

const EnergyGrowthSVG = ({ color }: { color?: string }) => (
    <DefaultSVG>
        <path
            style={{ fill: color || dfstyles.colors.text }}
            d='M251.6,164.4L416,0l-75,210H234.8L251.6,164.4z M407.4,224L284.2,343.4L224,512l288-288H407.4z'
        />
        <path
            style={{ fill: color || dfstyles.colors.text }}
            d='M288,0L0,288h176L96,512l288-288H208L288,0z'
        />
    </DefaultSVG>
);

export const EnergyGrowthIcon = ({ color }: { color?: string }) => (
    <SVGWrapper>
        <EnergyGrowthSVG color={color} />
    </SVGWrapper>
);

const EnergySVG = ({ color }: { color?: string }) => (
    <DefaultSVG>
        <path
            style={{ fill: color || dfstyles.colors.text }}
            d='M352 0l-288 288h176l-80 224 288-288h-176z'
        ></path>
    </DefaultSVG>
);

export const EnergyIcon = ({ color }: { color?: string }) => (
    <SVGWrapper>
        <EnergySVG color={color} />
    </SVGWrapper>
);

const PriceSVG = ({ color }: { color?: string }) => (
    <DefaultSVG>
        <path
            style={{ fill: color || dfstyles.colors.text }}
            d="M212 40H40V126H212V40ZM298 40H470V126H298V40ZM126 384H212V470H126H40V384V298H126V384ZM298 384H384V298H470V384V470H384H298V384Z"
        ></path>
    </DefaultSVG>
);

export const PriceIcon = ({ color }: { color?: string }) => (
    <SVGWrapper>
        <PriceSVG color={color} />
    </SVGWrapper>
);

export const StatIcon = ({ stat, color }: { stat: number, color?: string }) => {
    if (stat === 4) return <DefenseIcon color={color}/>;
    else if (stat === 1) return <EnergyGrowthIcon color={color}/>;
    else if (stat === 0) return <EnergyIcon color={color}/>;
    else if (stat === 2) return <RangeIcon color={color}/>;
    else if (stat === 3) return <SpeedIcon color={color}/>;
    else return <DefenseIcon />;
};
