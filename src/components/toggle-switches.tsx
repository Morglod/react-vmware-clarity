import * as React from 'react';
import { classNames } from 'utils';

export type ToggleProps = {
    id?: string,
    className?: string,
    value?: boolean,
    defaultValue?: boolean,
    disabled?: boolean,
    ariaLabelledby?: string,
    children?: any,
    /** alias for children */
    label?: string,
    onChange?: (newValue: boolean) => void
}

export class Toggle extends React.PureComponent<ToggleProps> {
    static defaultProps = {
        defaultValue: false
    };

    id = `${Date.now()}_${Math.random().toString().replace('.', 'x')}`;

    state: {
        value: boolean
    } = {
        value: this.props.value !== undefined ? this.props.value : this.props.defaultValue!
    }

    handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: evt.target.checked
        }, this.afterChange);
    };

    afterChange = () => {
        if (this.props.onChange)
            this.props.onChange(this.state.value);
    };

    render() {
        const {
            className,
            disabled,
            ariaLabelledby,
            children,
            label,
        } = this.props;

        const id = this.props.id !== undefined ? this.props.id : this.id;
        const value = this.props.value !== undefined ? this.props.value : this.state.value;

        return (
            <div
                className={classNames([
                    'toggle-switch',
                    className
                ])}
            >
                <input
                    type="checkbox"
                    id={id}
                    name={name}
                    checked={value !== false}
                    onChange={this.handleChange}
                    disabled={disabled}
                    aria-labelledby={ariaLabelledby}
                />
                <label htmlFor={id}> {label} {children}</label>
            </div>
        );
    }
}