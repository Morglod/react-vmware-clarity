import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Moment from 'moment';

// https://github.com/vmware/clarity/tree/master/src/clr-angular/forms/datepicker

import { ClrIcon } from 'icons';
import { classNames, isInTreeDOM } from 'utils';
import { SpaceAround, SpaceAroundStatus } from 'react-responsive-render';

export type DatePickerProps = {
    defaultValue?: Date,
    value?: Date,
    locale?: string,
    hidden?: boolean,
    onChange?: (newValue: Date) => void,
    className?: string,
    style?: any,
    readOnly?: boolean,
    renderDay?: (day: number, dateJS: number, viewMonthStart: Moment.Moment, pickedDay: Moment.Moment, select: Function) => React.ReactElement<any>
}

export enum DatePickerMode {
    DayPicker,
    MothPicker,
    YearPicker,
}

export type DatePickerState = {
    mode: DatePickerMode,
    value: Moment.Moment,
    viewValue: Moment.Moment,
}

export class DatePicker extends React.PureComponent<DatePickerProps, DatePickerState> {
    static defaultProps: DatePickerProps = {
        defaultValue: new Date(),
        locale: 'en'
    }

    static validDate(date: Date) {
        if (isNaN(date.getTime())) return new Date;
        return date;
    }

    state: DatePickerState = {
        mode: DatePickerMode.DayPicker,
        value: Moment(this.props.value !== undefined ? DatePicker.validDate(this.props.value) : this.props.defaultValue),
        viewValue: Moment(this.props.value !== undefined ? DatePicker.validDate(this.props.value) : this.props.defaultValue)
    }

    handlePrevMonth = () => {
        this.setState({
            viewValue: Moment(this.state.viewValue).subtract(1, 'months')
        })
    };

    handleNextMonth = () => {
        this.setState({
            viewValue: Moment(this.state.viewValue).add(1, 'months')
        })
    };

    handleSelectDay = (dateJS: number) => {
        if (this.props.readOnly) return;
        this.setState({
            value: Moment(dateJS).startOf('day'),
        }, this.afterSelectDay)
    };

    afterSelectDay = () => {
        if (this.props.onChange)
            this.props.onChange(this.state.value.toDate());
    };

    handleSetInitialMonth = () => {
        this.setState({
            viewValue: Moment(this.props.value !== undefined ? DatePicker.validDate(this.props.value) : this.props.defaultValue).startOf('month')
        })
    };

    handleToMonthPicker = () => {
        this.setState({
            mode: DatePickerMode.MothPicker
        })
    };

    handleToYearPicker = () => {
        this.setState({
            mode: DatePickerMode.YearPicker
        })
    };

    handlePrev10Years = () => {
        this.setState({
            viewValue: Moment(this.state.viewValue).subtract(10, 'years')
        })
    };

    handleNext10Years = () => {
        this.setState({
            viewValue: Moment(this.state.viewValue).add(10, 'years')
        })
    };

    handleSetInitialYear = () => {
        this.setState({
            viewValue: Moment(this.props.value !== undefined ? DatePicker.validDate(this.props.value) : this.props.defaultValue).startOf('month')
        })
    };

    render() {
        const {
            locale,
            hidden,
        } = this.props;

        const {
            mode,
            viewValue: moment,
        } = this.state;

        if (hidden) return null;

        const pickedMoment = this.props.value !== undefined ? Moment(DatePicker.validDate(this.props.value)) : this.state.value;
        if (locale) pickedMoment.locale(locale);

        const lastDayPrevMonth = Moment(moment).subtract(1, 'months').endOf('month');
        const lastDayPrevMonthDate = lastDayPrevMonth.date();
        const lastDayPrevMonthWeekday = lastDayPrevMonth.weekday() % 6 || 7;

        const viewDays: {
            /** date in utc milliseconds */
            dateJS: number,
            date: number,
            monthIndex: number
        }[] = [];

        const DAY_MS = 1000 * 60 * 60 * 24;

        for(let i = 0; i < lastDayPrevMonthWeekday; ++i) {
            const date = lastDayPrevMonthDate - (lastDayPrevMonthWeekday - i);
            viewDays.push({
                date,
                monthIndex: lastDayPrevMonth.month(),
                dateJS: lastDayPrevMonth.toDate().getTime() - ((lastDayPrevMonthWeekday - i) * DAY_MS),
            });
        }

        const firstDayMonth = Moment(moment).startOf('month');
        
        for(let i = 0; i < moment.daysInMonth(); ++i) {
            viewDays.push({
                date: i + 1,
                monthIndex: firstDayMonth.month(),
                dateJS: firstDayMonth.toDate().getTime() + (i * DAY_MS),
            });
        }

        const firstDayNextMonth = Moment(moment).add(1, 'months').startOf('month');
        const firstDayNextMonthWeekday = firstDayNextMonth.weekday();
    
        for(let i = 0; i < (firstDayNextMonth.date() + 7 + (firstDayNextMonthWeekday % 7)); ++i) {
            viewDays.push({
                date: i + 1,
                monthIndex: firstDayNextMonth.month(),
                dateJS: firstDayNextMonth.toDate().getTime() + (i * DAY_MS),
            });
        }

        const rows: (typeof viewDays)[] = [];
        for(let i = 0, rowsNum = Math.min(6, Math.ceil(viewDays.length / 7)); i < rowsNum; ++i) {
            rows.push(viewDays.slice(i * 7, i * 7 + 7));
        }

        const yearPickerBase = Math.floor(moment.year() / 10) * 10;

        return (
            <div className={classNames([ 'datepicker', this.props.className ])} style={this.props.style}>
                {mode === DatePickerMode.DayPicker ? (
                    <div>
                        <div className="calendar-header">
                            <div className="calendar-pickers">
                                <button
                                    className="calendar-btn monthpicker-trigger"
                                    type="button"
                                    children={moment.localeData().monthsShort()[ moment.month() ]}
                                    onClick={this.handleToMonthPicker}
                                />
                                <button
                                    className="calendar-btn yearpicker-trigger"
                                    type="button"
                                    children={moment.year()}
                                    onClick={this.handleToYearPicker}
                                />
                            </div>
                            <div className="calendar-switchers">
                                <button className="calendar-btn switcher" type="button" onClick={this.handlePrevMonth}>
                                    <ClrIcon dir="left" shape="angle" />
                                </button>
                                <button className="calendar-btn switcher" type="button" onClick={this.handleSetInitialMonth}>
                                    <ClrIcon shape="event" />
                                </button>
                                <button className="calendar-btn switcher" type="button" onClick={this.handleNextMonth}>
                                    <ClrIcon dir="right" shape="angle" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <table className="calendar-table weekdays">
                                <tbody>
                                    <tr className="calendar-row">
                                        {Moment.weekdaysShort(true).map(day =>
                                            <td key={day} className="calendar-cell weekday" children={day} />
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                            <table className="calendar-table calendar-dates">
                                <tbody>
                                    {rows.map((row, rowInd) =>
                                        <tr key={rowInd} className="calendar-row">
                                            {row.map((day) =>
                                                <td key={day.dateJS} className="calendar-cell">
                                                    <div className="day">
                                                        {this.props.renderDay ?
                                                            this.props.renderDay(day.date - 1, day.dateJS, moment, pickedMoment, () => this.handleSelectDay(day.dateJS))
                                                                : (
                                                            <button
                                                                className={classNames([
                                                                    'day-btn',
                                                                    day.monthIndex !== moment.month() && 'is-disabled',
                                                                    day.dateJS === Moment().startOf('day').toDate().getTime() && 'is-today',
                                                                    day.dateJS === pickedMoment.startOf('day').toDate().getTime() && 'is-selected'
                                                                ])}
                                                                type="button"
                                                                children={day.date}
                                                                onClick={() => this.handleSelectDay(day.dateJS)}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
                {mode === DatePickerMode.MothPicker ? (
                    <div className="monthpicker">
                        {moment.localeData().months().map((month, monthIndex) =>
                            <button
                                key={month}
                                className={classNames([
                                    'calendar-btn month',
                                    moment.month() === monthIndex && 'is-selected',
                                ])}
                                type="button"
                                children={month}
                                onClick={() => {
                                    this.setState({
                                        mode: DatePickerMode.DayPicker,
                                        viewValue: Moment(moment).month(monthIndex)
                                    })
                                }}
                            />)}
                    </div>
                ) : null}
                {mode === DatePickerMode.YearPicker ? (
                    <div className="yearpicker">
                        <div className="year-switchers">
                            <button className="calendar-btn switcher" type="button" onClick={this.handlePrev10Years}>
                                <ClrIcon dir="left" shape="angle" />
                            </button>
                            <button className="calendar-btn switcher" type="button" onClick={this.handleSetInitialYear}>
                                <ClrIcon shape="event" />
                            </button>
                            <button className="calendar-btn switcher" type="button" onClick={this.handleNext10Years}>
                                <ClrIcon dir="right" shape="angle" />
                            </button>
                        </div>
                        <div className="years">
                            {Array(10).fill(undefined).map((_, yearIndex) =>
                                <button
                                    key={yearIndex}
                                    className={classNames([
                                        'calendar-btn year',
                                        moment.year() === (yearPickerBase + yearIndex) && 'is-selected',
                                    ])}
                                    type="button"
                                    children={yearPickerBase + yearIndex}
                                    onClick={() => {
                                        this.setState({
                                            mode: DatePickerMode.DayPicker,
                                            viewValue: Moment(moment).year(yearPickerBase + yearIndex)
                                        })
                                    }}
                                />)}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export type DateInputProps = {
    defaultValue?: string|Date,
    value?: string|Date,
    locale?: string,
    style?: any,
    className?: string,
    onChange?: (newValue: string|Date) => void,
    readOnly?: boolean,
    readOnlyInput?: boolean,
    spaceAround?: boolean,
    isOpen?: boolean,
    defaultOpen?: boolean
}

export class DateInput extends React.PureComponent<DateInputProps> {
    static defaultProps: DateInputProps = {
        defaultValue: new Date(),
        spaceAround: true,
        locale: 'en'
    }

    static valueToString(value: string|Date, locale: string = 'en'): string {
        if (typeof value === 'string') return value;
        return Moment(value).locale(locale).format('L');
    }

    state: {
        isOpen: boolean,
        value: string
    } = {
        isOpen: this.props.defaultOpen || false,
        value: DateInput.valueToString(this.props.value !== undefined ? this.props.value : (this.props.defaultValue || new Date)),
    };

    get isOpen() {
        return this.props.isOpen !== undefined ? this.props.isOpen : this.state.isOpen;
    }

    componentWillUnmount() {
        this.unsubscribeDocumentClick();
    }

    handleDatePickerButtonClick = (evt: React.MouseEvent<any>) => {
        evt.preventDefault();
        this.toggleDatePicker();
    };

    toggleDatePicker = (newState = !this.state.isOpen) => {
        this.setState({
            isOpen: newState
        }, this.afterToggleDatePicker);
    };

    afterToggleDatePicker = () => {
        if (this.isOpen) this.subscribeDocumentClick();
        else this.unsubscribeDocumentClick();
    };

    handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            value: evt.target.value
        }, this.afterInputChange);
    };

    afterInputChange = () => {
        if (this.props.onChange)
            this.props.onChange(this.state.value);
    };

    handleDatePickerChange = (newValue: Date) => {
        this.toggleDatePicker(false);
        this.setState({
            value: DateInput.valueToString(newValue, this.props.locale)
        }, this.props.onChange ? (() => this.props.onChange!(newValue)) : undefined);
    };

    subscribeDocumentClick = () => {
        window.addEventListener('click', this.handleDocumentClick as any, true);
    };

    unsubscribeDocumentClick = () => {
        window.removeEventListener('click', this.handleDocumentClick as any, true);
    };

    handleDocumentClick = (evt: React.MouseEvent<HTMLElement>) => {
        if (!this.state.isOpen) return;
        const target = evt.target as any as HTMLElement;
        const el = ReactDOM.findDOMNode(this);
        if (!el || typeof el === 'string') {
            console.warn('wrong element type');
            return;
        }
        if (!isInTreeDOM(el, target)) {
            this.toggleDatePicker(false);
        }
    };

    render() {
        const {
            readOnly,
            readOnlyInput,
            className,
            style,
            locale,
            spaceAround
        } = this.props;

        const value = this.props.value !== undefined ? DateInput.valueToString(this.props.value) : this.state.value;

        if (spaceAround) {
            const containerInput = (
                <div className="date-container" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder={Moment.localeData(locale).longDateFormat('L')}
                        value={value}
                        readOnly={readOnly || readOnlyInput}
                        onChange={this.handleInputChange}
                    />
                    <button type="button" className="datepicker-trigger" onClick={this.handleDatePickerButtonClick}>
                        <ClrIcon className="datepicker-trigger-icon" shape="calendar" />
                    </button>
                </div>
            );

            if (!this.isOpen) return containerInput;

            return (
                <SpaceAround
                    container="span"
                    calcStyle
                    immediate
                    timeout={1000}
                    item={(status, style) => (
                        this.isOpen ? (
                            <DatePicker
                                style={{
                                    position: 'absolute',
                                    display: 'inline',
                                    top: style.top,
                                    left: 0
                                }}
                                value={Moment(value, Moment.localeData(locale).longDateFormat('L')).toDate()}
                                readOnly={readOnly}
                                onChange={this.handleDatePickerChange}
                            />
                        ) : <div />
                    )}
                    children={containerInput}
                />
            );
        } else {
            return (
                <div className="date-container" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder={Moment.localeData(locale).longDateFormat('L')}
                        value={value}
                        readOnly={readOnly || readOnlyInput}
                        onChange={this.handleInputChange}
                    />
                    <button type="button" className="datepicker-trigger" onClick={this.handleDatePickerButtonClick}>
                        <ClrIcon className="datepicker-trigger-icon" shape="calendar" />
                    </button>
                    {this.isOpen ? (
                        <DatePicker
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0
                            }}
                            value={Moment(value, Moment.localeData(locale).longDateFormat('L')).toDate()}
                            readOnly={readOnly}
                            onChange={this.handleDatePickerChange}
                        />
                    ) : null}
                </div>
            );
        }
    }
}