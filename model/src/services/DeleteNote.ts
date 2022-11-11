import { DataMapperInterface } from "@notes/model/datamappers";
import { DispatcherInterface } from "@notes/event";
import { Note } from "@notes/model/entities";
import { NoteEvent } from "@notes/model/events";

/**
 * Removes note entities.
 */
class DeleteNote {
    /**
     * Note entity data mapper.
     */
    private readonly notes: DataMapperInterface<Note>;

    /**
     * Application event dispatcher.
     */
    private readonly dispatcher: DispatcherInterface;

    /**
     * Create a new note removal service instance.
     *
     * @param noteDataMapper Note entity data mapper.
     * @param eventDispatcher Application event dispatcher.
     */
    public constructor(noteDataMapper: DataMapperInterface<Note>, eventDispatcher: DispatcherInterface) {
        this.notes = noteDataMapper;
        this.dispatcher = eventDispatcher;
    }

    /**
     * Remove the given note entity.
     *
     * @param note Note entity instance.
     * @return Promise resolving when the operation is done.
     */
    public async byReference(note: Note): Promise<void> {
        await this.notes.delete(note);
        await this.dispatcher.dispatch("note:deleted", new NoteEvent(note));
    }
}

export default DeleteNote;
