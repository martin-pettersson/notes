import { Note } from "@notes/model/entities";
import { NoteCriteria } from "@notes/model/repositories";
import { RepositoryInterface } from "@notes/model/repositories";

/**
 * Lists note entities.
 */
class ListNotes {
    /**
     * Note repository instance.
     */
    private readonly notes: RepositoryInterface<Note>;

    /**
     * Create a new note listing service instance.
     *
     * @param noteRepository Note repository instance.
     */
    public constructor(noteRepository: RepositoryInterface<Note>) {
        this.notes = noteRepository;
    }

    /**
     * Lists note entities matching given parameters.
     *
     * @param parameters Arbitrary parameters.
     * @return Promise resolving with a set of matching entities.
     */
    public matching(parameters: {[key: string]: string}): Promise<Set<Note>> {
        return this.notes.matching(NoteCriteria.fromParameters(parameters));
    }
}

export default ListNotes;
