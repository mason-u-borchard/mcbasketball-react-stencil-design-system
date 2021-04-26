import React from 'react';
import ReactDom from 'react-dom';

import { attachEventProps, createForwardRef, dashToPascalCase, isCoveredByReact } from './utils';

export interface ReactProps {
    className?: string;
}

interface McBasketballReactInternalProps<ElementType> {
    forwardedRef?: React.Ref<ElementType>;
    children?: React.ReactNode;
    href?: string;
    target?: string;
    style?: string;
    ref?: React.Ref<any>;
    className?: string;
}

export const createReactComponent = <PropType, ElementType>(
    tagName: string,
) => {
    const displayName = dashToPascalCase(tagName);
    const ReactComponent = class extends React.Component<McBasketballReactInternalProps<ElementType>> {

        constructor(props: McBasketballReactInternalProps<ElementType>) {
            super(props);
        }

        componentDidMount() {
            this.componentDidUpdate(this.props);
        }

        componentDidUpdate(prevProps: McBasketballReactInternalProps<ElementType>) {
            const node = ReactDom.findDOMNode(this) as HTMLElement;
            attachEventProps(node, this.props, prevProps);
        }

        render() {
            const { children, forwardedRef, style, className, ref, ...cProps } = this.props;

            const propsToPass = Object.keys(cProps).reduce((acc, name) => {
                if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
                    const eventName = name.substring(2).toLowerCase();
                    if (isCoveredByReact(eventName)) {
                        (acc as any)[name] = (cProps as any)[name];
                    }
                }
                return acc;
            }, {});

            const newProps: any = {
                ...propsToPass,
                ref: forwardedRef,
                style
            };

            return React.createElement(
                tagName,
                newProps,
                children
            );
        }

        static get displayName() {
            return displayName;
        }
    };
    return createForwardRef<PropType & ReactProps, ElementType>(ReactComponent, displayName);
};