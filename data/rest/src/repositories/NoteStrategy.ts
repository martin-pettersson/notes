import { CriteriaInterface, NoteCriteria, RepositoryInterface, isPaginated } from "@notes/model/repositories";
import { Note } from "@notes/model/entities";

/**
 * A REST implementation of a note repository strategy.
 */
class NoteStrategy implements RepositoryInterface<Note> {
    /**
     * REST API URL.
     */
    private readonly url: any;

    /**
     * Fetch implementation.
     */
    private readonly fetch: any;

    /**
     * Create a new REST note repository strategy instance.
     *
     * @param url REST API URL.
     * @param fetch Fetch implementation.
     */
    public constructor(url: URL, fetch: any) {
        this.url = url;
        this.fetch = fetch;
    }

    /** @inheritDoc */
    public async matching(criteria: CriteriaInterface<Note>): Promise<Set<Note>> {
        try {
            const response = await this.fetch(new URL(`/v1/notes${this.queryFor(criteria)}`, this.url));

            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            const notes = await response.json() as Array<any>;

            return new Set(
                notes
                    .map(
                        note => new Note(
                            note.id,
                            note.title,
                            note.content,
                            new Date(note.created),
                            new Date(note.lastUpdated)
                        )
                    )
                    .filter(criteria.isSatisfiedBy.bind(criteria))
            );
        } catch (error) {
            throw new Error(`Unable to fetch notes: ${error.message}`);
        }
    }

    /**
     * Produce a URL query from the given note criteria.
     *
     * @param criteria Arbitrary note criteria.
     * @return String representing the criteria as a URL query.
     */
    private queryFor(criteria: CriteriaInterface<Note>): string {
        const parameters = new URLSearchParams();

        if (criteria instanceof NoteCriteria && criteria.searchPhrase !== null) {
            parameters.set("q", criteria.searchPhrase);
        }

        if (isPaginated(criteria)) {
            parameters.set("page", String(criteria.offset / Math.max(criteria.limit, 1) + 1));
            parameters.set("page_size", String(criteria.limit));
        }

        const queryString = parameters.toString();

        return queryString.length > 0 ? `?${queryString}` : "";
    }
}

export default NoteStrategy;
