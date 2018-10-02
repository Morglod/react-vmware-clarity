import * as React from 'react';
import { classNames } from 'utils';

import { Tooltip, TooltipProps } from './tooltips';

export type InputFieldProps = {
    id?: string,
    name?: string,
    type?: string,
    className?: string,
    placeholder?: string,
    readOnly?: boolean,
    value?: string,
    defaultValue?: string,
    onChange?: (newValue: string) => void,
    label?: string,
    textarea?: boolean,
    /** textarea rows number */
    rows?: number,
    required?: boolean,
    tooltip?: TooltipProps & { validation?: boolean },
    invalid?: boolean,
    pattern?: string|RegExp,
    minLength?: number,
    maxLength?: number,
    /** number of characters the input box can display at a time */
    size?: number,
    /** auto complete value suggestions */
    options?: string[],
    /** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autocomplete */
    autoComplete?: string,
    title?: string,

    [otherInputProps: string]: any,
}

export class InputField extends React.PureComponent<InputFieldProps> {
    static defaultProps = {
        type: 'text'
    }

    id = `${Date.now()}_${Math.random().toString().replace('.', 'x')}`;

    handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(evt.target.value);
    };

    render() {
        const {
            label,
            type,
            textarea,
            rows,
            placeholder,
            readOnly,
            className,
            defaultValue,
            required,
            tooltip,
            invalid,
            value,
            pattern: patternAny,
            maxLength,
            minLength,
            size,
            name,
            options,
            autoComplete,
            title,
            ...otherInputProps
        } = this.props;

        const id = this.props.id !== undefined ? this.props.id : this.id;
        const labelRendered = label && <label htmlFor={id} children={label} className={classNames([ required && 'required' ])} />;
        const Input = textarea ? 'textarea' : 'input';
        const pattern: string|undefined = patternAny !== undefined ? (patternAny instanceof RegExp ? patternAny.source : patternAny) : undefined;

        let inputRendered = (
            <>
                <Input
                    id={id}
                    name={name}
                    rows={rows}
                    type={type}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    required={required}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={this.handleChange}
                    pattern={pattern}
                    minLength={minLength}
                    maxLength={maxLength}
                    size={size}
                    autoComplete={autoComplete}
                    title={title}
                    {...otherInputProps as any}
                />
                {options && (
                    <datalist id={id}>
                        {options.map(option =>
                            <option key={option} value={option} />)}
                    </datalist>
                )}
            </>
        );

        if (tooltip) {
            inputRendered = (
                <Tooltip
                    container="label"
                    containerProps=""
                    children={inputRendered}
                    position="top-right"
                    {...tooltip}
                    {...{ validation: undefined }}
                    className={classNames([
                        tooltip.className,
                        invalid && 'invalid',
                        tooltip.validation && 'tooltip-validation',
                    ])}
                />
            );
        }

        if (labelRendered) {
            return (
                <div className={classNames([ "form-group", className ])}>
                    {labelRendered}
                    {inputRendered}
                </div>
            )
        }

        return (
            inputRendered
        );
    }
}