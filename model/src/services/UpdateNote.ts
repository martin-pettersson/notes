import { DataMapperInterface } from "@notes/model/datamappers";
import { DispatcherInterface } from "@notes/event";
import { Note } from "@notes/model/entities/index";
import { NoteUpdatedEvent } from "@notes/model/events";
import { Validator } from "@moonwalkingbits/apollo/validation";
import { update } from "@notes/model/configuration/validation/note";

/**
 * Updates note entities.
 */
class UpdateNote {
    /**
     * Note entity data mapper.
     */
    private readonly notes: DataMapperInterface<Note>;

    /**
     * Configured validator instance.
     */
    private readonly validator: Validator;

    /**
     * Application event dispatcher.
     */
    private readonly dispatcher: DispatcherInterface;

    /**
     * Create a new note update service instance.
     *
     * @param noteDataMapper Note entity data mapper.
     * @param validator Configured validator instance.
     * @param eventDispatcher Application event dispatcher.
     */
    public constructor(
        noteDataMapper: DataMapperInterface<Note>,
        validator: Validator,
        eventDispatcher: DispatcherInterface
    ) {
        this.notes = noteDataMapper;
        this.validator = validator;
        this.dispatcher = eventDispatcher;
    }

    /**
     * Update note with the given object.
     *
     * @param note Note entity instance.
     * @param object Arbitrary key/value object.
     * @return Promise resolving with an updated note entity.
     */
    public async withObject(note: Note, object: any): Promise<Note> {
        this.validator.validate(object, update);

        const now = new Date();
        const updatedNote = note
            .withTitle(object.title)
            .withContent(object.content)
            .lastUpdatedAt(
                new Date(
                    Date.UTC(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes() + now.getTimezoneOffset(),
                        now.getSeconds()
                    )
                )
            );

        await this.notes.update(updatedNote);
        await this.dispatcher.dispatch("note:updated", new NoteUpdatedEvent([updatedNote, note]));

        return updatedNote;
    }
}

export default UpdateNote;
