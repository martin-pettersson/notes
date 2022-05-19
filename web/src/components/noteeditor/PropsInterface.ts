import { Note } from "@notes/model/entities";

/**
 * Represents the note editor component's properties.
 */
interface PropsInterface {
    /**
     * Note entity instance.
     */
    note: Note;

    /**
     * Threshold for auto saving in milliseconds.
     */
    autoSaveThreshold: number;

    /**
     * Called when a note has been saved.
     *
     * @param note Note entity instance.
     */
    onSave?(note: Note): void;

    /**
     * Called when a note has been removed.
     *
     * @param note Note entity instance.
     */
    onRemove?(note: Note): void;
}

export default PropsInterface;
