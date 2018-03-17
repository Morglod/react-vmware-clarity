import * as React from 'react';
import { classNames } from 'utils';

export type TooltipProps = {
    className?: string,
    children?: any,
    content: any,
    size?: 'xs'|'sm'|'md'|'lg',
    position?: 'top-right'|'top-left'|'bottom-right'|'bottom-left'|'right'|'left'
}

export class Tooltip extends React.PureComponent<TooltipProps> {
    render() {
        const { className, children, position, size, content } = this.props;

        if (!children) return null;

        return (
            <span
                className={classNames([
                    className,
                    'tooltip',
                    `tooltip-${size || 'md'}`,
                    `tooltip-${position || 'right'}`
                ])}
                role="tooltip"
                aria-haspopup="true"
            >
                {children}
                <span className="tooltip-content" children={content} />
            </span>
        );
    }
}