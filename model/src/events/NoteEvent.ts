import { Event } from "@notes/model/event";
import { Note } from "@notes/model/entities";

/**
 * Note entity specific event.
 */
class NoteEvent extends Event<Note> {}

export default NoteEvent;
