import { DataMapperInterface, DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";
import { Note } from "@notes/model/entities";

/**
 * A REST implementation of a note data mapper.
 */
class NoteDataMapper implements DataMapperInterface<Note>{
    /**
     * REST API URL.
     */
    private readonly url: any;

    /**
     * Fetch implementation.
     */
    private readonly fetch: any;

    /**
     * Create a new REST note data mapper instance.
     *
     * @param url REST API URL.
     * @param fetch Fetch implementation.
     */
    public constructor(url: URL, fetch: any) {
        this.url = url;
        this.fetch = fetch;
    }

    /** @inheritDoc */
    public async get(id: string): Promise<Note | null> {
        try {
            const response = await this.fetch(new URL(`/v1/notes/${id}`, this.url), {
                headers: {
                    ["Accept"]: "application/json"
                }
            });

            if (response.status === 404) {
                return null;
            }

            if (response.status !== 200) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            const body = await response.json();

            return new Note(
                body.id,
                body.title,
                body.content,
                new Date(body.created),
                new Date(body.lastUpdated)
            );
        } catch (error) {
            throw new Error(`Unable to fetch note: ${error.message}`);
        }
    }

    /** @inheritDoc */
    public async insert(note: Note): Promise<void> {
        try {
            const response = await this.fetch(new URL("/v1/notes", this.url), {
                method: "POST",
                headers: {
                    ["Content-Type"]: "application/json"
                },
                body: JSON.stringify(note)
            });

            if (response.status === 422) {
                this.throwIfDuplicate(await response.json());
            }

            if (response.status !== 201) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            if (error instanceof DuplicateEntityError) {
                throw error;
            }

            throw new Error(`Unable to insert note: ${error.message}`);
        }
    }

    /** @inheritDoc */
    public async update(note: Note): Promise<void> {
        try {
            const response = await this.fetch(new URL(`/v1/notes/${note.id}`, this.url), {
                method: "PUT",
                headers: {
                    ["Content-Type"]: "application/json"
                },
                body: JSON.stringify(note)
            });

            if (response.status === 404) {
                throw new EntityNotFoundError(note.id);
            }

            if (response.status !== 204) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw error;
            }

            throw new Error(`Unable to update note: ${error.message}`);
        }
    }

    /** @inheritDoc */
    public async delete(note: Note): Promise<void> {
        try {
            const response = await this.fetch(new URL(`/v1/notes/${note.id}`, this.url), {
                method: "DELETE"
            });

            if (![204, 404].includes(response.status)) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Unable to remove note: ${error.message}`);
        }
    }

    /**
     * Throw error if the given issues indicates an attempt to create a duplicate note.
     *
     * @param issues Arbitrary issues object.
     */
    private throwIfDuplicate(issues: {[property: string]: Array<string>}): void {
        for (const [ property, propertyIssues ] of Object.entries(issues)) {
            if (propertyIssues.some(issue => issue.includes("unique"))) {
                throw new DuplicateEntityError(property);
            }
        }
    }
}

export default NoteDataMapper;
