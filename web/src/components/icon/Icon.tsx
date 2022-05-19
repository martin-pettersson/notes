import * as React from "react";
import { Component, ReactElement } from "react";
import { PropsInterface, StateInterface } from ".";

/**
 * Represents an SVG icon.
 */
class Icon extends Component<PropsInterface, StateInterface> {
    /**
     * Produce a visual representation of the component.
     *
     * @return React element representing the component's current state.
     */
    public render(): ReactElement {
        const classNames = [
            ...(this.props.className ?? "").split(" ").filter(className => className.length > 0),

            "icon",
            `icon--${this.props.name}`
        ];

        return (
            <span className={classNames.join(" ")}>
                <svg xmlns="http://www.w3.org/2000/svg" role="presentation">
                    <use href={`/icons.svg#${this.props.name}`}/>
                </svg>
            </span>
        );
    }
}

export default Icon;
