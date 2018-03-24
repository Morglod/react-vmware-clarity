import * as React from 'react';
import { classNames } from 'utils';

import './checkboxes.css';

export type CheckboxValue = boolean|'indeterminate';

export type CheckboxProps = {
    id?: string,
    ariaLabelledby?: string,
    name?: string,
    disabled?: boolean,
    /** alias for `value` */
    checked?: CheckboxValue,
    /** alias for `defaultValue` */
    defaultChecked?: CheckboxValue,
    value?: CheckboxValue,
    defaultValue?: CheckboxValue,
    onChange?: (newValue: CheckboxValue) => void,
    className?: string,
    inline?: boolean,
    style?: any,
}

export class Checkbox extends React.PureComponent<CheckboxProps> {
    id = `${Date.now()}_${Math.random().toString().replace('.', 'x')}`;
    $input: HTMLInputElement = null!;

    getValue = (props = this.props, state = this.state): CheckboxValue => {
        const valueProp = props.checked !== undefined ? props.checked : props.value;
        const defaultValueProp = props.defaultChecked !== undefined ? props.defaultChecked : props.defaultValue;
        return valueProp !== undefined ? valueProp : (state ? state.value : defaultValueProp) || false;
    };

    state: {
        value: CheckboxValue
    } = {
        value: this.getValue(this.props, undefined),
    }

    get value(): CheckboxValue {
        return this.getValue();
    }

    componentDidMount() {
        this.$input.indeterminate = this.value === 'indeterminate';
    }

    componentDidUpdate() {
        this.$input.indeterminate = this.value === 'indeterminate';
    }

    handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const hardValue = this.props.value !== undefined || this.props.checked !== undefined;

        const checked = evt.target.checked;
        const indeterminate = evt.target.indeterminate;
        const newValue = indeterminate ? 'indeterminate' : checked;

        if (hardValue) {
            evt.preventDefault();
            if (this.props.onChange)
                this.props.onChange(newValue);
        } else {
            this.setState({ value: newValue });
        }
    };

    render() {
        const {
            disabled,
            children,
            name,
            className,
            ariaLabelledby,
            inline,
            style,
        } = this.props;

        const value = this.value;
        const id = this.props.id !== undefined ? this.props.id : this.id;

        return (
            <div
                className={classNames([
                    'checkbox',
                    className,
                    disabled && 'disabled',
                    inline && 'checkbox-inline'
                ])}
                style={style}
            >
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    ref={r => this.$input = r!}
                    checked={value !== false}
                    onChange={this.handleChange}
                    disabled={disabled}
                    aria-labelledby={ariaLabelledby}
                />
                <label htmlFor={id} children={children} />
            </div>
        );
    }
}