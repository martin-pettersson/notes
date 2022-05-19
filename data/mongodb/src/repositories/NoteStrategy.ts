import { CriteriaInterface, NoteCriteria, RepositoryInterface, isPaginated } from "@notes/model/repositories";
import { Db } from "mongodb";
import { Note } from "@notes/model/entities";

/**
 * A MongoDB implementation of a note entity repository strategy.
 */
class NoteStrategy implements RepositoryInterface<Note> {
    /**
     * Database connection instance.
     */
    private readonly connection: Db;

    /**
     * Create a new note repository strategy instance.
     *
     * @param connection Database connection instance.
     */
    public constructor(connection: Db) {
        this.connection = connection;
    }

    /** @inheritDoc */
    public async matching(criteria: CriteriaInterface<Note>): Promise<Set<Note>> {
        const cursor = this.connection.collection("notes").find(this.queryObjectFor(criteria));

        if (isPaginated(criteria)) {
            cursor.skip(criteria.offset);
            cursor.limit(criteria.limit);
        }

        return new Set(
            (await cursor.toArray())
                .map(
                    document => new Note(
                        document._id.toString(),
                        document.title,
                        document.content,
                        document.created,
                        document.lastUpdated
                    )
                )
                .filter(criteria.isSatisfiedBy.bind(criteria))
        );
    }

    /**
     * Produce a MongoDB query object from the given criteria.
     *
     * @param criteria Arbitrary note criteria.
     * @return MongoDB query object representing the given criteria.
     */
    private queryObjectFor(criteria: CriteriaInterface<Note>): Object {
        if (!(criteria instanceof NoteCriteria) || criteria.searchPhrase === null) {
            return {};
        }

        return {
            $or: [
                {
                    title: {
                        $regex: criteria.searchPhrase
                    }
                },
                {
                    content: {
                        $regex: criteria.searchPhrase
                    }
                }
            ]
        };
    }
}

export default NoteStrategy;
