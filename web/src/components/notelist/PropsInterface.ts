import { Note } from "@notes/model/entities";

/**
 * Represents the note list component's properties.
 */
interface PropsInterface {
    /**
     * Called when a note is selected from the list.
     *
     * @param note Selected note entity.
     */
    onSelection?(note?: Note): void;
}

export default PropsInterface;
