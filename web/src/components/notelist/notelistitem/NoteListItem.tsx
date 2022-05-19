import * as React from "react";
import { PropsInterface } from ".";
import { ReactElement } from "react";

/**
 * Represents a selectable note list item.
 *
 * @param props Component properties.
 * @return React element representing the component's current state.
 */
function NoteListItem({ note, isSelected, onClick }: PropsInterface): ReactElement {
    const classNames = [
        "note"
    ];

    if (isSelected) {
        classNames.push("note--selected");
    }

    return (
        <article className={classNames.join(" ")} onClick={() => onClick?.(note)}>
            <span className="note__title">
                {note.title}
            </span>
            <div className="note__content">
                {note.content}
            </div>
        </article>
    );
}

export default NoteListItem;
