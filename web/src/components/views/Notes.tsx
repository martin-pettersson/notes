import * as React from "react";
import { Note as NoteEntity } from "@notes/model/entities";
import { NoteEditor, NoteList } from "@notes/web/components";
import { ReactElement, useState } from "react";

/**
 * Produces the notes view layout.
 */
function Notes(): ReactElement {
    const [ note, setNote ] = useState<NoteEntity>();

    return (
        <div className="view view--notes">
            <aside className="view__sidebar">
                <NoteList onSelection={setNote}/>
            </aside>
            <div className="view__content">
                {note && (
                    <NoteEditor note={note}/>
                )}
            </div>
        </div>
    );
}

export default Notes;
