import * as React from 'react';
import { classNames } from 'utils';

export type TableProps = {
    children?: any,
    className?: string,
    noBorder?: boolean,
    compact?: boolean,
    vertical?: boolean,
}

export class Table extends React.PureComponent<TableProps> {
    static LeftClassName = 'left';

    render() {
        const {
            className,
            children,
            noBorder,
            compact,
            vertical,
        } = this.props;

        return (
            <table
                className={classNames([
                    'table',
                    className,
                    noBorder && 'table-noborder',
                    compact && 'table-compact',
                    vertical && 'table-vertical',
                ])}
                children={children}
            />
        );
    }
}