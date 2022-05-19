import { Note } from "@notes/model/entities";

/**
 * Represents the note list item component's properties.
 */
interface PropsInterface {
    /**
     * Note entity instance.
     */
    note: Note;

    /**
     * Whether the list item is selected.
     */
    isSelected?: boolean;

    /**
     * Element click handler.
     *
     * @param note Note entity instance.
     */
    onClick?(note: Note): void;
}

export default PropsInterface;
