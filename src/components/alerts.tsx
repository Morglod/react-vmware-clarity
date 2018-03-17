import * as React from 'react';
import { classNames, unreachableCode } from 'utils';
import { ClrIcon } from 'icons';

export type AlertType =
    { type: 'danger'|'warning'|'info'|'success', danger?: undefined, warning?: undefined, info?: undefined, success?: undefined } |
    { type?: undefined, danger: boolean, warning?: undefined, info?: undefined, success?: undefined } |
    { type?: undefined, danger?: undefined, warning: boolean, info?: undefined, success?: undefined } |
    { type?: undefined, danger?: undefined, warning?: undefined, info: boolean, success?: undefined } |
    { type?: undefined, danger?: undefined, warning?: undefined, info?: undefined, success: boolean };

export type AlertItem = {
    text: string,
    actions?: any,
    icon?: string,
}

export type AlertItemOrItems =
    (AlertItem & { items?: undefined }) |
    {
        items: AlertItem[],
        text?: undefined,
        actions?: undefined,
        icon?: undefined,
    }

export type AlertProps =
    AlertType &
    AlertItemOrItems &
    {
        hidden?: boolean,
        children?: undefined,
        closable?: boolean,
        onClose?: React.MouseEventHandler<any>,
        appLevel?: boolean,
        small?: boolean,
        className?: string,
    }

function TypeToClassName(type: AlertType) {
    if (type.type) return `-${type.type}`;
    else if (type.danger !== undefined) return '-danger';
    else if (type.warning !== undefined) return '-warning';
    else if (type.info !== undefined) return '-info';
    else if (type.success !== undefined) return '-success';
    return unreachableCode();
}

export function AlertNormalizeItems(items: AlertItemOrItems): AlertItem[] {
    if (items.items !== undefined) return items.items;
    else return [ items as any ];
}

export class Alert extends React.PureComponent<AlertProps> {
    render() {
        const { closable, onClose, appLevel, small, hidden, className } = this.props;
        if (hidden) return null;

        const items = AlertNormalizeItems(this.props);

        return (
            <div
                className={classNames([
                    className,
                    'alert',
                    'alert' + TypeToClassName(this.props),
                    appLevel && 'alert-app-level',
                    small && 'alert-sm'
                ])}
            >
                <div className="alert-items">
                    {items.map((item, i) => (
                        <div className="alert-item static" key={i}>
                            {item.icon && <div className="alert-icon-wrapper">
                                <ClrIcon className="alert-icon" shape={item.icon} />
                            </div>}
                            <span className="alert-text" children={item.text} />
                            <div className="alert-actions" children={item.actions} />
                        </div>
                    ))}
                </div>
                {closable &&
                    <button type="button" className="close" aria-label="Close" onClick={onClose}>
                        <ClrIcon aria-hidden="true" shape="close" />
                    </button>}
            </div>
        );
    }
}

export type AlertsPagerProps = {
    current: number,
    count: number,
    onChange: (newIndex: number) => void,
    className?: string,
}

export class AlertsPager extends React.PureComponent<AlertsPagerProps> {
    handleLeft = () => {
        const newIndex = (this.props.current - 1) % this.props.count;
        this.props.onChange((newIndex < 0) ? (this.props.count - newIndex) : newIndex);
    };

    handleRight = () => {
        const newIndex = (this.props.current + 1) % this.props.count;
        this.props.onChange(newIndex);
    };

    render() {
        const { current, count, className } = this.props;

        return (
            <div className={classNames([ className, 'alerts-pager' ])}>
                <div className="alerts-pager-control">
                    <div className="alerts-page-down">
                        <button className="alerts-pager-button" onClick={this.handleLeft}>
                            <ClrIcon shape="caret left" />
                        </button>
                    </div>
                    <div className="alerts-pager-text">{current + 1} / {count}</div>
                    <div className="alerts-page-up">
                        <button className="alerts-pager-button" onClick={this.handleRight}>
                            <ClrIcon shape="caret right" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export type AlertsProps = {
    children: React.ReactElement<AlertProps>[],
    onChange?: (newIndex: number) => void,
    className?: string,
}

export class Alerts extends React.Component<AlertsProps> {
    state = {
        currentIndex: 0
    };

    handleAlertChange = (newIndex: number) => {
        this.setState({
            currentIndex: newIndex
        }, this.afterIndexChange);
    };

    afterIndexChange = () => {
        if (this.props.onChange)
            this.props.onChange(this.state.currentIndex);
    };

    render() {
        const { children, className } = this.props;
        const { currentIndex } = this.state;
        const current = children[currentIndex];

        const alertTypeClassName = current ? 'alert' + TypeToClassName(current.props) : '';

        return (
            <div className={classNames([ className, 'alerts', alertTypeClassName ])}>
                <AlertsPager
                    current={this.state.currentIndex}
                    onChange={this.handleAlertChange}
                    count={children.length}
                />
                {current}
            </div>
        )
    }
}