import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { classNames, isInTreeDOM } from 'utils';
import { ClrIcon } from 'icons';

export const ModalBackdrop = (props: { children?: any, className?: string, onClick?: (evt: React.MouseEvent<HTMLDivElement>) => void }) => (
    <div className={classNames([ 'modal-backdrop', props.className ])} onClick={props.onClick} children={props.children} aria-hidden="true" />
);

export const ModalHeader = (props: { children?: any, className?: string }) => (
    <h3 className={classNames([ 'modal-title', props.className ])} children={props.children} />
);

export const ModalFooter = (props: { children?: any, className?: string, modal: Modal }) => (
    <div
        className={classNames([ 'modal-footer', props.className ])}
        children={typeof props.children === 'function' ?
            props.children(props.modal) :
            props.children}
    />
);

export const ModalBody = (props: { children?: any, className?: string }) => (
    <div className={classNames([ 'modal-body', props.className ])} children={props.children} />
);

export const CANCEL_CLOSE: 'cancelClose' = 'cancelClose';
export type OnClose = () => (Promise<undefined|typeof CANCEL_CLOSE>|undefined|void|typeof CANCEL_CLOSE);

export type ModalProps = {
    isOpen?: boolean,
    defaultOpen?: boolean,
    closable?: boolean,
    staticBackdrop?: boolean,
    size?: 'small' | 'medium' | 'large' | 'extra',
    title?: string,
    body?: any,
    footer?: ((modal: Modal) => any) | React.ReactElement<any>,
    noBackdrop?: boolean,
    onClose?: OnClose,
    onAnyClose?: OnClose,
}

export class Modal extends React.PureComponent<ModalProps> {
    static Backdrop = ModalBackdrop;
    static Header = ModalHeader;
    static Footer = ModalFooter;
    static Body = ModalBody;

    state: {
        isOpen: boolean
    } = {
        isOpen: this.props.defaultOpen !== undefined ? this.props.defaultOpen : this.props.isOpen || false
    }

    private $el: HTMLDivElement|null = null;

    get isOpen() {
        return this._isOpen();
    }

    private _isOpen = (props = this.props, state = this.state) =>
        props.isOpen !== undefined ? props.isOpen : state.isOpen;

    open = () => {
        this.setState({ isOpen: true })
    };

    private _close = () => {
        this.setState({ isOpen: false });
    }

    close = async (fromInputEvent: false|'inputEvent' = false) => {
        if (this.isOpen) {
            if (this.props.onAnyClose) {
                const result = await this.props.onAnyClose();
                if (result === CANCEL_CLOSE) return;
            }
            if (fromInputEvent === 'inputEvent' && this.props.onClose) {
                const result = await this.props.onClose();
                if (result === CANCEL_CLOSE) return;
            }
            this._close();
        }
    };

    toggle = (isOpen = !this.state.isOpen) => {
        if (isOpen) this.open();
        else this.close();
    };

    componentWillUpdate(nextProps: ModalProps, nextState: any) {
        if (this._isOpen(nextProps, nextState)) {
            if (this.$el === null) {
                const el = document.createElement('div');
                document.body.appendChild(el);
                this.$el = el;
            }
            document.body.classList.add('no-scrolling');
        } else {
            this.dispose(true);
        }
    }

    componentWillUnmount() {
        this.dispose();
    }

    private dispose = (a = false) => {
        if (this.$el !== null) {
            document.body.removeChild(this.$el);
            this.$el = null;
        }
        if (this.isOpen || a) document.body.classList.remove('no-scrolling');
    };

    handleCloseCrossClick = () => {
        this.close('inputEvent');
    };

    handleModalClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        const target = evt.target as any;
        // filter not '.modal > .modal-dialog'
        if (
            !target.firstChild ||
            !(target.firstChild.classList && target.firstChild.classList.contains('modal-dialog'))
        ) return;

        if (this.props.closable && !this.props.staticBackdrop) {
            this.close('inputEvent');
        }
    };

    renderModal() {
        const {
            children,
            title,
            body,
            footer,
            size,
            noBackdrop,
            closable,
        } = this.props;

        const hasHeader = closable || title;
        const childrenIsBody = title && footer && !body;

        return (
            <>
                <div className="modal" onClick={this.handleModalClick}>
                    <div
                        className={classNames([
                            "modal-dialog fadeDown in",
                            size === 'small' && 'modal-sm',
                            size === 'large' && 'modal-lg',
                            size === 'extra' && 'modal-xl'
                        ])}
                        role="dialog"
                        aria-hidden={true}
                    >
                        <div className="modal-content">
                            {hasHeader && (
                                <div className="modal-header">
                                    {closable && <button
                                        className="close"
                                        aria-label="Close"
                                        type="button"
                                        onClick={this.handleCloseCrossClick}
                                    >
                                        <ClrIcon shape="close" />
                                    </button>}
                                    {title && (
                                        <ModalHeader>
                                            {title}
                                        </ModalHeader>
                                    )}
                                </div>
                            )}
                            {body && <ModalBody children={body} />}
                            {childrenIsBody && <ModalBody children={children} />}
                            {!childrenIsBody && children}
                            {footer && <ModalFooter modal={this} children={footer} />}
                        </div>
                    </div>
                </div>
                {!noBackdrop && <ModalBackdrop />}
            </>    
        );
    }

    render() {
        return this.isOpen ? ReactDOM.createPortal(this.renderModal(), this.$el!) : null;
    }
}