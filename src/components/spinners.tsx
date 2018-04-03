import * as React from 'react';
import { classNames } from 'utils';

export type SpinnerProps = {
    inline?: boolean,
    inverse?: boolean,
    /** alias for children */
    label?: string,
    children?: any,
    size?: 'small'|'medium'|'large',
    small?: boolean,
    medium?: boolean,
    large?: boolean
}

export class Spinner extends React.PureComponent<SpinnerProps> {
    render() {
        const {
            inline,
            inverse,
            label,
            children,
            size,
            small,
            medium,
            large,
        } = this.props;

        return (
            <span>
                <span
                    className={classNames([
                        'spinner',
                        inline && 'spinner-inline',
                        inverse && 'spinner-inverse',
                        (size === 'small' || small) && 'spinner-sm',
                        (size === 'medium' || medium) && 'spinner-md',
                        (size === 'large' || large) && 'spinner-lg',
                    ])}
                />
                <span> {label} {children}</span>
            </span>
        );
    }
}