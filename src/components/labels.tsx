import * as React from 'react';
import { classNames } from 'utils';

export type LabelProps = {
    className?: string,
    color?: string,
    type?: 'danger'|'warning'|'info'|'success',
    onClick?: Function,
    children?: any,
}

export class Label extends React.PureComponent<LabelProps> {
    render() {
        const { className, color, type, children, onClick } = this.props;

        if (!children) return null;

        return (
            <span
                className={classNames([
                    className,
                    'label',
                    type && `label-${type}`,
                    color && `label-${color}`,
                    onClick && 'clickable',
                ])}
                onClick={onClick as any}
                children={children}
            />
        );
    }
}