import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ButtonProps, Button } from './buttons';
import { classNames, isInTreeDOM } from 'utils';

export const DropDownHeader = (props: { className?: string, children?: any } = {}) => (
    <h4 className={classNames([ 'dropdown-header', props.className ])} children={props.children} />
);

export const DropDownDivider = (props: { className?: string, children?: undefined } = {}) => (
    <div className={classNames([ 'dropdown-divider', props.className ])} />
);

export const DropDownItem = (props: { className?: string, children?: any, onClick?: Function, active?: boolean, disabled?: boolean } = {}) => (
    <button
        className={classNames([
            'dropdown-item',
            props.className,
            props.active && 'active',
            props.disabled && 'disabled',
        ])}
        type="button"
        children={props.children}
        onClick={props.onClick as any}
    />
);

export type DropDownItem = {
    label?: string,
    divider?: boolean,
    className?: string,
    key?: string,
    children?: any,
    active?: boolean,
    disabled?: boolean,
    menu?: DropDownMenuProps,
    menuOpen?: boolean,
    defaultMenuOpen?: boolean,
    onClick?: Function,
}

export const STOP_PROPAGATION: 'stopPropagation' = 'stopPropagation';
export type OnItemClickResult = void|undefined|typeof STOP_PROPAGATION|Promise<undefined|typeof STOP_PROPAGATION>;

export type DropDownMenuProps = {
    itemsPath?: string,
    onItemClick?: (item: DropDownItem, itemPath: string) => OnItemClickResult,
    header?: string,
    className?: string,
    items?: DropDownItem[],
    children?: any,
    closeOnItemClick?: boolean,
    closeOnBackdrop?: boolean
    hidden?: boolean,
    _level?: number
}

export class DropDownMenu extends React.PureComponent<DropDownMenuProps> {
    static defaultProps = {
        closeOnItemClick: true,
        closeOnBackdrop: true,
        itemsPath: '',
        _level: 0
    }

    render(): any {
        const {
            className,
            children,
            items,
            header,
            onItemClick,
            itemsPath,
            closeOnBackdrop,
            hidden,
            _level,
        } = this.props;

        return (
            <div className={classNames([ 'dropdown-menu', className ])} hidden={hidden}>
                {header ? <DropDownHeader children={header} /> : null}
                {items ? (
                    items.map((item, itemIndex) => {
                        const key = item.key || item.label || itemIndex.toString();
                        const itemPath = `${itemsPath}/${key}`;

                        if (item.divider) {
                            return <DropDownDivider key={key} />;
                        }

                        const renderedItem = (
                            <DropDownItem
                                key={key}
                                className={classNames([
                                    'dropdown-item',
                                    item.className,
                                    item.menu && 'expandable'
                                ])}
                                active={item.active || item.menuOpen}
                                disabled={item.disabled}
                                onClick={() => {
                                    return propogationChain(item, itemPath, [
                                        item.onClick,
                                        onItemClick
                                    ]);
                                }}
                            >
                                {item.label}
                                {item.children}
                            </DropDownItem>
                        )
                        
                        if (item.menu) {
                            return (
                                <DropDown
                                    key={key}
                                    isOpen={item.menuOpen}
                                    defaultOpen={item.defaultMenuOpen}
                                    closeOnBackdrop={closeOnBackdrop}
                                    _level={_level! + 1}
                                    {...item.menu}
                                    itemsPath={itemPath}
                                    className={classNames([
                                        _level! % 2 === 0 ? 'right-bottom' : 'left-top',
                                        item.menu.className
                                    ])}
                                    dropdownItem={renderedItem}
                                    onItemClick={((clickedItem, itemPath) => {
                                        return propogationChain(clickedItem, itemPath, [
                                            clickedItem.onClick,
                                            item.menu!.onItemClick,
                                            onItemClick,
                                        ]);
                                    })}
                                />
                            );
                        }
                        
                        return renderedItem;
                    })
                ): null}
                {children}
            </div>
        )
    }
}

async function propogationChain(item: any, itemPath: any, funcs: any[]) {
    for(const func of funcs) {
        if (func) {
            let r;
            r = await func(item, itemPath);
            if (r === STOP_PROPAGATION) return STOP_PROPAGATION;
        }
    }
    return undefined;
}

export type DropDownProps = {
    button?: ButtonProps,
    dropdownItem?: any,
    children?: any,
    className?: string,
    menuClassName?: string,
    menuChildren?: any,
    isOpen?: boolean,
    defaultOpen?: boolean
} & DropDownMenuProps;

export class DropDown extends React.PureComponent<DropDownProps> {
    static defaultProps = {
        closeOnItemClick: true,
        closeOnBackdrop: true,
        itemsPath: '',
        _level: 0
    };
    
    static STOP_PROPOGATION = STOP_PROPAGATION;
    static Header = DropDownHeader;
    static Divider = DropDownDivider;
    static Menu = DropDownMenu;

    state: {
        isOpen: boolean
    } = {
        isOpen: this.props.defaultOpen || false
    };

    componentWillUnmount() {
        this.unsubscribeDocumentClick();
    }
    
    get isOpen() {
        return this.props.isOpen !== undefined ? this.props.isOpen : this.state.isOpen;
    }

    toggle = (isOpen = !this.state.isOpen) => {
        this.setState({ isOpen }, this.afterToggle);
    };

    afterToggle = () => {
        if (this.isOpen) this.subscribeDocumentClick();
        else this.unsubscribeDocumentClick();
    };

    handleButtonClick = () => {
        if (this.props.button && this.props.button.onClick)
            this.props.button.onClick();
        else
            this.toggle();
    };

    subscribeDocumentClick = () => {
        window.addEventListener('click', this.handleDocumentClick as any, true);
    };

    unsubscribeDocumentClick = () => {
        window.removeEventListener('click', this.handleDocumentClick as any, true);
    };

    handleDocumentClick = (evt: React.MouseEvent<HTMLElement>) => {
        if (!this.state.isOpen || !this.props.closeOnBackdrop) return;
        const target = evt.target as any as HTMLElement;
        if (!isInTreeDOM(ReactDOM.findDOMNode(this), target)) {
            this.toggle(false);
        }
    };

    handleItemClick = async (item: DropDownItem, itemPath: string = '') => {
        const r = await propogationChain(item, itemPath, [ this.props.onItemClick ]);
        if (r === STOP_PROPAGATION) return;
        if (this.props.closeOnItemClick) this.toggle(false);
        return undefined;
    };

    render() {
        const button = {
            icon: 'caret down',
            ...this.props.button,
        };

        const {
            className,
            children,
            header,
            menuClassName,
            items,
            menuChildren,
            dropdownItem,
            onItemClick,
            itemsPath,
            closeOnItemClick,
            closeOnBackdrop,
            hidden,
            _level,
        } = this.props;

        const isOpen = this.props.isOpen !== undefined ? this.props.isOpen : this.state.isOpen;

        return (
            <div className={classNames([ 'dropdown', isOpen && 'open', className ])} hidden={hidden}>
                {dropdownItem !== undefined ? (
                    React.cloneElement(dropdownItem, {
                        active: isOpen,
                        onClick: () => {
                            if (dropdownItem.onClick)
                                dropdownItem.onClick();
                            this.toggle();
                        }}
                    )
                 ) : (
                    button ? <Button
                        {...button}
                        onClick={this.handleButtonClick}
                        className={classNames([ (button as any).className, 'dropdown-toggle' ])}
                    /> : (
                        <Button
                            label="Dropdown"
                            icon="caret down"
                            onClick={this.handleButtonClick}
                            className={classNames([ (button as any).className, 'dropdown-toggle' ])}
                        />
                    )
                )}
                {((items && items.length !== 0) || menuChildren) && <DropDownMenu
                    hidden={!isOpen}
                    header={header}
                    className={menuClassName}
                    items={items}
                    children={menuChildren}
                    onItemClick={this.handleItemClick}
                    itemsPath={itemsPath}
                    closeOnItemClick={closeOnItemClick}
                    closeOnBackdrop={closeOnBackdrop}
                    _level={_level!}
                />}
                {children}
            </div>
        )
    }
}