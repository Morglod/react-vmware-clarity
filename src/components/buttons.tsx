import * as React from 'react';
import { classNames } from 'utils';
import { ClrIcon } from 'icons';
import { Tooltip } from './tooltips';
import { ResponsiveItems } from 'react-responsive-render';

export type ButtonType = {
    type?: 'primary'|'danger'|'warning'|'info'|'success',
    submit?: boolean,
    primary?: boolean,
    danger?: boolean,
    warning?: boolean,
    info?: boolean,
    success?: boolean,
}

export type ButtonProps = ButtonType & {
    className?: string,
    /** alias for children */
    label?: string,
    children?: any,
    disabled?: boolean,
    outline?: boolean,
    flat?: boolean,
    small?: boolean,
    block?: boolean,
    icon?: string,
    loading?: boolean,
    onClick?: Function,
    title?: string,
}

function TypeToStr(type: ButtonType) {
    if (type.type) return `${type.type}`;
    else if (type.danger !== undefined) return 'danger';
    else if (type.warning !== undefined) return 'warning';
    else if (type.info !== undefined) return 'info';
    else if (type.success !== undefined) return 'success';
    else if (type.primary !== undefined) return 'primary';
    return '';
}

export class Button extends React.PureComponent<ButtonProps> {
    render() {
        const { className, children, label, disabled, outline, flat, small, block, icon, loading, onClick, title, submit } = this.props;
        const type = TypeToStr(this.props);

        const rendered = (
            <button
                className={classNames([
                    className,
                    'btn',
                    flat && 'btn-link',
                    small && 'btn-sm',
                    `btn${type ? '-' + type : ''}${outline ? '-outline' : ''}`,
                    block && 'btn-block',
                    icon && 'btn-icon'
                ])}
                disabled={disabled}
                onClick={onClick as any}
                type={submit ? 'submit': undefined}
            >
                {(!loading && icon) && <ClrIcon shape={icon} key="icon" />}
                {loading && <span className="spinner spinner-inline" />}
                {(loading || icon) && ' '}
                {label}
                {children}
            </button>
        );

        if (title) {
            return (
                <Tooltip content={title}>
                    {rendered}
                </Tooltip>
            );
        }

        return rendered;
    }
}

export type ButtonGroupOverflowProps = {
    className?: string,
    defaultOpen?: boolean,
    open?: boolean,
    onToggle?: (newState: boolean) => void,
    children?: any
}

export class ButtonGroupOverflow extends React.Component<ButtonGroupOverflowProps> {
    state = {
        isOpen: this.props.defaultOpen || false,
    };

    handleToggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        }, this.afterToggle);
    };

    afterToggle = () => {
        if (this.props.onToggle)
            this.props.onToggle(this.state.isOpen);
    };

    render() {
        const { children, className } = this.props;
        const isOpen = this.props.open !== undefined ? this.props.open : this.state.isOpen;

        return (
            <div
                className={classNames([
                    className,
                    'btn-group-overflow',
                    isOpen && 'open'
                ])}
            >
                <button className="btn dropdown-toggle" onClick={this.handleToggle}>
                    <ClrIcon shape="ellipsis-horizontal" />
                </button>
                <div className="dropdown-menu">
                    {children}
                </div>
            </div>
        );
    }
}

export type ButtonGroupProps = {
    className?: string,
    primary?: boolean,
    flat?: boolean,
    small?: boolean,
    children: React.ReactElement<any>[],

    /** buttons limit */
    limit?: number,
    minButtonWidth?: number
}

export class ButtonGroup extends React.PureComponent<ButtonGroupProps> {
    render() {
        const { children, className, primary, flat, small, limit, minButtonWidth } = this.props;

        if (!children || children.length === 0)
            return null;

        if (minButtonWidth) {
            if (limit) {
                console.warn('ButtonGroup: limit not working with minButtonWidth');
            }

            return (
                <ResponsiveItems
                    items={children}
                    minItemWidth={minButtonWidth}
                    children={({ children, restItems }) => (
                        <div>
                            <div
                                className={classNames([
                                    className,
                                    'btn-group',
                                    primary && 'btn-primary',
                                    flat && 'btn-link',
                                    small && 'btn-sm',
                                ])}
                            >
                                {children}
                                {restItems.length ? <ButtonGroupOverflow children={restItems} /> : null }
                            </div>
                        </div>
                    )}
                />
            );
        } else {
            return (
                <div
                    className={classNames([
                        className,
                        'btn-group',
                        primary && 'btn-primary',
                        flat && 'btn-link',
                        small && 'btn-sm',
                    ])}
                >
                    {(limit && children.length > limit) ? (
                        <>
                            {children.slice(0, limit)}
                            <ButtonGroupOverflow>
                                {children.slice(limit)}
                            </ButtonGroupOverflow>
                        </>
                    ) : children}
                </div>
            );
        }
    }
}