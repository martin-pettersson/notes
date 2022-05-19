import { Note } from "@notes/model/entities";

/**
 * Represents the note list component's state.
 */
interface StateInterface {
    /**
     * Whether the component is in a loading state.
     */
    isLoading: boolean;

    /**
     * Whether the component is currently creating a note.
     */
    isCreating: boolean;

    /**
     * List of note entities.
     */
    notes: Array<Note>;

    /**
     * Currently selected note.
     */
    selectedNote?: Note;

    /**
     * Current notes search phrase.
     */
    currentSearchPhrase?: string;
}

export default StateInterface;
