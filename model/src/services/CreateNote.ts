import { DataMapperInterface, DuplicateEntityError } from "@notes/model/datamappers";
import { DispatcherInterface } from "@notes/event";
import { Note } from "@notes/model/entities";
import { NoteEvent } from "@notes/model/events";
import { Validator, ValidatorError } from "@moonwalkingbits/apollo/validation";
import { create } from "@notes/model/configuration/validation/note";
import { v4 as createUuid } from "uuid";

/**
 * Creates note entities.
 */
class CreateNote {
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
     * Create a new note creation service instance.
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
     * Create a note entity instance from the given object.
     *
     * @param object Arbitrary note object representation.
     * @return Promise resolving with a note instance.
     */
    public async fromObject(object: any): Promise<Note> {
        this.validator.validate(object, create);

        const now = new Date();
        const created = new Date(
            Date.UTC(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                now.getMinutes() + now.getTimezoneOffset(),
                now.getSeconds()
            )
        );
        const note = new Note(
            object.id ?? createUuid(),
            object.title,
            object.content,
            created,
            created
        );

        try {
            await this.notes.insert(note);
            await this.dispatcher.dispatch("note:created", new NoteEvent(note));

            return note;
        } catch (error) {
            if (error instanceof DuplicateEntityError) {
                throw new ValidatorError("Must be unique", error.property);
            }

            throw error;
        }
    }
}

export default CreateNote;
