import * as React from 'react';
import { classNames } from 'utils';

export type RadioProps = {
    id?: string,
    className?: string,
    name?: string,
    value: string,
    checked?: boolean,
    defaultChecked?: boolean,
    disabled?: boolean,
    ariaLabelledby?: string,
    children?: any,
    /** alias for children */
    label?: string,
    onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export class Radio extends React.PureComponent<RadioProps> {
    static defaultProps = {
        defaultChecked: false
    };

    id = `${Date.now()}_${Math.random().toString().replace('.', 'x')}`;

    render() {
        const {
            className,
            disabled,
            ariaLabelledby,
            children,
            label,
            name,
        } = this.props;

        const id = this.props.id !== undefined ? this.props.id : this.id;

        return (
            <div
                className={classNames([
                    'radio',
                    className
                ])}
            >
                <input
                    type="radio"
                    id={id}
                    name={name}
                    checked={this.props.checked}
                    value={this.props.value}
                    defaultChecked={this.props.defaultChecked}
                    onChange={this.props.onChange}
                    disabled={disabled}
                    aria-labelledby={ariaLabelledby}
                />
                <label htmlFor={id}> {label} {children}</label>
            </div>
        );
    }
}

export type RadioGroupProps = {
    onChange?: (value: string) => void,
    children?: any,
}

export class RadioGroup extends React.PureComponent<RadioGroupProps> {
    handleChange = (evt: React.ChangeEvent<any>) => {
        if (this.props.onChange)
            this.props.onChange(evt.target.value);
    };

    render() {
        return (
            <div onChange={this.handleChange}>
                {this.props.children}
            </div>
        );
    }
}