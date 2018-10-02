import * as React from 'react';
import * as ReactDOM from 'react-dom';

// http://prismjs.com/#languages-list
import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/prism.js';
import 'prismjs/components/prism-typescript.min.js';
import * as Prism from 'prismjs';

export function countWhitespace(text: string) {
    let i = 0;
    for(; i < text.length; ++i) {
        if (text[i] !== ' ')
            return i;
    }
    return i;
}

export function smartTrim(text: string) {
    const lines = text.split('\n').filter(x => x.trim() !== '');
    let minSpace: number = Number.MAX_VALUE;

    for(const line of lines) {
        const c = countWhitespace(line);
        if (minSpace > c) minSpace = c;
    }

    for(let i = 0; i < lines.length; ++i) {
        lines[i] = lines[i].substr(minSpace);
    }

    return lines.join('\n');
}

export type CodeProps = {
    /** http://prismjs.com/#languages-list */
    lang?: string,
    children?: string,
    trim?: boolean,
}

export class Code extends React.PureComponent<CodeProps> {
    componentDidMount() {
        this.highlight();
    }

    componentDidUpdate() {
        this.highlight();
    }

    $code: any = null;

    highlight = () => {
        const el = ReactDOM.findDOMNode(this.$code);
        if (!el || typeof el === 'string') {
            console.warn('wrong element type');
            return;
        }
        Prism.highlightElement(el);
    }

    render() {
        return (
            <pre>
                <code
                    ref={r => this.$code = r} 
                    className={'language-' + this.props.lang}
                    children={this.props.trim ? smartTrim(this.props.children! as any) : this.props.children}
                />
            </pre>
        );
    }
}