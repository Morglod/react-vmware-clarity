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
        children?: undefined,
        close?: boolean,
        onClose?: React.MouseEventHandler<any>,
    }

export function TypeToClassName(type: AlertType) {
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
        const { close, onClose } = this.props;
        const items = AlertNormalizeItems(this.props);

        return (
            <div
                className={classNames([ 'alert', 'alert' + TypeToClassName(this.props) ])}
            >
                <div className="alert-items">
                    {items.map((item, i) => (
                        <div className="alert-item static" key={i}>
                            <div className="alert-icon-wrapper">
                                <ClrIcon className="alert-icon" shape="info-circle" />
                            </div>
                            <div className="alert-text" children={item.text} />
                            <div className="alert-actions" children={item.actions} />
                        </div>
                    ))}
                </div>
                { close &&
                    <button type="button" className="close" aria-label="Close" onClick={onClose}>
                        <ClrIcon aria-hidden="true" shape="close" />
                    </button>}
            </div>
        );
    }
}