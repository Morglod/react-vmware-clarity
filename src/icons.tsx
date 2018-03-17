import * as React from 'react'; 

export * from '@clr/icons';

// export * from '@clr/icons/shapes/chart-shapes';
export declare const ClrShapeAxisChart: string;
export declare const ClrShapeBarChart: string;
export declare const ClrShapeBoxPlot: string;
export declare const ClrShapeBubbleChart: string;
export declare const ClrShapeCloudChart: string;
export declare const ClrShapeCurveChart: string;
export declare const ClrShapeGridChart: string;
export declare const ClrShapeHeatMap: string;
export declare const ClrShapeLineChart: string;
export declare const ClrShapePieChart: string;
export declare const ClrShapeScatterPlot: string;
export declare const ClrShapeTickChart: string;
export declare const ChartShapes: any;

export * from '@clr/icons/shapes/commerce-shapes';
export * from '@clr/icons/shapes/core-shapes';
export * from '@clr/icons/shapes/essential-shapes';
export * from '@clr/icons/shapes/media-shapes';
export * from '@clr/icons/shapes/social-shapes';
export * from '@clr/icons/shapes/technology-shapes';
export * from '@clr/icons/shapes/travel-shapes';

export type ClrIconProps = {
    className?: string,
    shape: string,
    dir?: string,
    style?: string,
    size?: string,
    flip?: 'vertical'|'horizontal',
    children?: undefined,
}

export class ClrIcon extends React.PureComponent<ClrIconProps> {
    render() {
        const { className, ...props } = this.props;

        return React.createElement('clr-icon', {
            class: className,
            ...props
        });
    }
}