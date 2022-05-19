import { DataMapperInterface } from "@notes/model/datamappers";
import { Note } from "@notes/model/entities";

/**
 * Retrieves note entities.
 */
class GetNote {
    /**
     * Note entity data mapper.
     */
    private readonly notes: DataMapperInterface<Note>;

    /**
     * Create a new note retrieval service instance.
     *
     * @param noteDataMapper Note entity data mapper.
     */
    public constructor(noteDataMapper: DataMapperInterface<Note>) {
        this.notes = noteDataMapper;
    }

    /**
     * Retrieve a note entity instance matching the given id.
     *
     * @param id Unique identifier.
     * @return Promise resolving with a note entity instance if found.
     */
    public byId(id: string): Promise<Note | null> {
        return this.notes.get(id);
    }
}

export default GetNote;
