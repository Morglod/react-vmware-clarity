import * as React from 'react';

import { classNames } from 'utils';

export type SelectProps = {
    value?: string|string[],
    defaultValue?: string|string[],
    options?: ({
        [key: string]: string
    }) | string[],
    multiple?: boolean,
    disabled?: boolean,
    onChange?: (newValue: string[]) => void,
}

export class Select extends React.PureComponent<SelectProps> {
    static normalizeValue(value: string|string[]) {
        if (Array.isArray(value)) return value;
        return [ value ];
    }

    state: {
        value: string[]
    } = {
        value: this.props.value !== undefined ? Select.normalizeValue(this.props.value) : Select.normalizeValue(this.props.defaultValue || '')
    };

    handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const target = evt.target;
        const selected: string[] = [];
        for(let i = 0; i < target.options.length; ++i) {
            if (target.options[i].selected) selected.push(target.options[i].value);
        }

        this.setState({
            value: selected
        }, this.afterChange);
    };

    afterChange = () => {
        if (this.props.onChange)
            this.props.onChange(this.state.value);
    };

    render() {
        const {
            multiple,
            disabled
        } = this.props;

        let options: any = this.props.options;
        if (Array.isArray(this.props.options)) {
            options = {};
            this.props.options.forEach(x => options[x] = x);
        }

        const value = this.props.value !== undefined ? Select.normalizeValue(this.props.value) : this.state.value;

        return (
            <div
                className={classNames([
                    'select',
                    disabled && 'disabled',
                    multiple && 'multiple',
                ])}
            >
                <select multiple={multiple} disabled={disabled} onChange={this.handleChange}>
                    {Object.entries(options).map(([ optionKey, optionValue ]) =>
                        <option
                            value={optionKey}
                            children={optionValue}
                            key={optionKey}
                            selected={optionKey in value}
                        />)}
                </select>
            </div>
        )
    }
}