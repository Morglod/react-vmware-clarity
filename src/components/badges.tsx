import * as React from 'react';
import { classNames } from 'utils';

export type BadgeProps = {
    className?: string,
    color?: string,
    type?: 'danger'|'warning'|'info'|'success',
    children?: string|number,
}

export class Badge extends React.PureComponent<BadgeProps> {
    render() {
        const { className, color, type, children } = this.props;

        if (!children) return null;

        return (
            <span
                className={classNames([
                    className,
                    'badge',
                    type && `badge-${type}`,
                    color && `badge-${color}`
                ])}
                children={typeof children === 'number' && (children > 99) ? '99+' : children}
            />
        );
    }
}