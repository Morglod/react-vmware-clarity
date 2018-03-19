import * as React from 'react';
import { classNames } from 'utils';

export type CardProps = {
    className?: string,
    onClick?: Function,
    header?: any,
    footer?: any,
    title?: any,
    text?: any,
    children?: any,
    image?: any,
}

export const CardHeader = (props: { className?: string, children?: any }) =>
    <div
        className={classNames([ "card-header", props.className ])}
        children={props.children}
    />

export const CardImage = (props: { className?: string, image?: any, children?: undefined }) =>
    <div className={classNames([ "card-img", props.className ])}>
        <img src={props.image} />
    </div>

export const CardBlock = (props: { className?: string, children?: any }) =>
    <div
        className={classNames([ "card-block", props.className ])}
        children={props.children}
    />

export const CardTitle = (props: { className?: string, children?: any }) =>
    <div
        className={classNames([ "card-title", props.className ])}
        children={props.children}
    />

export const CardText = (props: { className?: string, children?: any }) =>
    <div
        className={classNames([ "card-text", props.className ])}
        children={props.children}
    />

export const CardFooter = (props: { className?: string, children?: any }) =>
    <div
        className={classNames([ "card-footer", props.className ])}
        children={props.children}
    />

export const CardMediaBlock = (props: {
    image?: string, className?: string, children?: any,
    title?: string, text?: string, wrap?: boolean
}) =>
    <div className={classNames([ "card-media-block", props.className, props.wrap && 'wrap' ])} >
        {props.image && <img src={props.image} className="card-media-image" />}
        <div className="card-media-description">
            {props.title && <span className="card-media-title" children={props.title} />}
            {props.text && <span className="card-media-text" children={props.text} />}
            {props.children}
        </div>
    </div>

export class Card extends React.PureComponent<CardProps> {
    render() {
        const {
            className,
            onClick,
            header,
            footer,
            title,
            text,
            children,
            image
        } = this.props;

        const hasBlock = title || text;

        return (
            <div
                className={classNames([
                    className,
                    'card',
                    onClick && 'clickable',
                ])}
            >
                {header && <CardHeader children={header} />}
                {image &&  <CardImage image={image} />}
                {hasBlock &&
                    <CardBlock>
                        {title && <CardTitle children={title} />}
                        {text && <CardText children={text} />}
                    </CardBlock>}
                {children}
                {footer && <CardFooter children={footer} />}
            </div>
        );
    }
}