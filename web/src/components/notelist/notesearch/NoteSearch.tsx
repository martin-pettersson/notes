import * as React from "react";
import { Component, KeyboardEvent, ReactElement, RefObject, createRef } from "react";
import { Icon } from "@notes/web/components";
import { PropsInterface, StateInterface } from ".";

/**
 * Represents an interactive note search input field.
 */
class NoteSearch extends Component<PropsInterface, StateInterface> {
    /**
     * Text input element reference.
     */
    private readonly inputRef: RefObject<HTMLInputElement>;

    /**
     * Create a new note search component instance.
     *
     * @param props Component properties.
     */
    public constructor(props: PropsInterface) {
        super(props);

        this.inputRef = createRef();
    }

    /**
     * Propagate current search intent.
     */
    private propagateSearchIntent(): void {
        this.props.onSearchIntent?.(this.inputRef.current?.value ?? "");
    }

    /**
     * Handles any actions on user input.
     *
     * @param event Keyboard event triggering the change.
     * @private
     */
    private handleInputChange(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === "Escape") {
            this.inputRef.current!.value = "";
        }

        if (["Enter", "Escape"].includes(event.key)) {
            this.propagateSearchIntent();
        }
    }

    /**
     * Produce a visual representation of the component.
     *
     * @return React element representing the component's current state.
     */
    public render(): ReactElement {
        return (
            <span className="note-list__search-field">
                <input
                    ref={this.inputRef}
                    type="text"
                    placeholder="Search Notes..."
                    onKeyDown={this.handleInputChange.bind(this)}
                />
                <button onClick={this.propagateSearchIntent.bind(this)}>
                    <Icon name="search"/>
                </button>
            </span>
        );
    }
}

export default NoteSearch;
