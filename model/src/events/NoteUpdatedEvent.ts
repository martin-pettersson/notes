import { Note } from "@notes/model/entities";
import { UpdateEvent } from "@notes/model/events";

/**
 * Note entity specific update event.
 */
class NoteUpdatedEvent extends UpdateEvent<Note> {}

export default NoteUpdatedEvent;
