import * as React from 'react';
import { classNames, unreachableCode } from 'utils';
import { ClrIcon } from 'icons';

export type ButtonType =
    { type: 'primary'|'danger'|'warning'|'info'|'success', primary?: undefined, danger?: undefined, warning?: undefined, info?: undefined, success?: undefined } |
    { type?: undefined, danger: boolean, warning?: undefined, info?: undefined, success?: undefined, primary?: undefined } |
    { type?: undefined, danger?: undefined, warning: boolean, info?: undefined, success?: undefined, primary?: undefined } |
    { type?: undefined, danger?: undefined, warning?: undefined, info: boolean, success?: undefined, primary?: undefined } |
    { type?: undefined, danger?: undefined, warning?: undefined, info?: undefined, success: boolean, primary?: undefined } |
    { type?: undefined, danger?: undefined, warning?: undefined, info?: undefined, success?: undefined, primary: boolean };

export type ButtonProps = ButtonType & {
    className?: string,
    children?: any,
    disabled?: boolean,
    outline?: boolean,
    flat?: boolean,
    small?: boolean,
    block?: boolean,
    icon?: string,
    loading?: boolean,
    onClick?: Function,

    // TODO: Tooltip
    title?: string,
}


function TypeToStr(type: ButtonType) {
    if (type.type) return `${type.type}`;
    else if (type.danger !== undefined) return 'danger';
    else if (type.warning !== undefined) return 'warning';
    else if (type.info !== undefined) return 'info';
    else if (type.success !== undefined) return 'success';
    else if (type.primary !== undefined) return 'primary';
    return unreachableCode();
}

export class Button extends React.PureComponent<ButtonProps> {
    render() {
        const { className, children, disabled, outline, flat, small, block, icon, loading, onClick } = this.props;
        const type = TypeToStr(this.props);

        return (
            <button
                className={classNames([
                    className,
                    'btn',
                    flat && 'btn-link',
                    small && 'btn-sm',
                    `btn-${type}${outline ? '-outline' : ''}`,
                    block && 'btn-block',
                    icon && 'btn-icon'
                ])}
                disabled={disabled}
                onClick={onClick as any}
            >
                {(!loading && icon) && <ClrIcon shape={icon} key="icon" />}
                {loading && <span className="spinner spinner-inline" />}
                {(loading || icon) && ' '}
                {children}
            </button>
        );
    }
}

// export type ButtonGroupProps = {
//     className?: string,
//     children?: React.ReactElement<ButtonProps>[]
// }

// export class ButtonGroup extends React.PureComponent<ButtonGroupProps> {
//     render() {
//         const { children, className } = this.props;

//         return (
//             <div
//                 className={classNames([
//                     className,
//                     'btn-group',
//                 ])}
//             >
//                 {children}
//             </div>
//         );
//     }
// }