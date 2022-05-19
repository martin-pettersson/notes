import { AbstractPaginatedCriteria } from "@notes/model/repositories";
import { Note } from "@notes/model/entities";

/**
 * Represents a set of note entity criteria.
 */
class NoteCriteria extends AbstractPaginatedCriteria<Note> {
    /**
     * Arbitrary search phrase to match notes against
     */
    private _searchPhrase: string | null;

    /**
     * Arbitrary search phrase to match notes against.
     */
    public get searchPhrase(): string | null {
        return this._searchPhrase;
    }

    /**
     * Create a criteria instance from the given parameters.
     *
     * @param parameters Arbitrary criteria parameters.
     * @return Note criteria instance.
     */
    public static fromParameters(parameters: {[key: string]: string}): NoteCriteria {
        const criteria = new NoteCriteria();

        if ("q" in parameters) {
            criteria.matchingSearchPhrase(parameters.q!);
        }

        if ("page" in parameters) {
            criteria.onPage(parseInt(parameters.page!));
        }

        if ("page_size" in parameters) {
            criteria.withPageSize(parseInt(parameters.page_size!));
        }

        return criteria;
    }

    /**
     * Create a new note criteria instance.
     *
     * @param searchPhrase Arbitrary search phrase to match notes against.
     */
    public constructor(searchPhrase: string | null = null) {
        super(0, 10);

        this._searchPhrase = searchPhrase;
    }

    /** @inheritDoc */
    public isSatisfiedBy(note: Note): boolean {
        return this.matchesSearchPhrase(note);
    }

    /**
     * Configure criteria to match against a given search phrase.
     *
     * @param searchPhrase Arbitrary search phrase to match notes against.
     * @return Same instance for method chaining.
     */
    public matchingSearchPhrase(searchPhrase: string): NoteCriteria {
        this._searchPhrase = searchPhrase;

        return this;
    }

    /**
     * Determine whether a given note entity matches the search phrase criteria.
     *
     * @param note Note entity instance.
     * @return True if the given note entity matches the search phrase criteria.
     */
    private matchesSearchPhrase(note: Note): boolean {
        if (this.searchPhrase === null) {
            return true;
        }

        return note.title.includes(this.searchPhrase) || note.content.includes(this.searchPhrase);
    }
}

export default NoteCriteria;
