import { AbstractEntity } from "@notes/model/entities";

/**
 * Represents a note in the system.
 */
class Note extends AbstractEntity {
    /**
     * Short descriptive title.
     */
    public readonly title: string;

    /**
     * Arbitrary content.
     */
    public readonly content: string;

    /**
     * Moment the entity was created.
     */
    public readonly created: Date;

    /**
     * Moment the entity was last updated.
     */
    public readonly lastUpdated: Date;

    /**
     * Create a new note entity instance.
     *
     * @param id Unique identifier.
     * @param title Short descriptive title.
     * @param content Arbitrary content.
     * @param created Moment the entity was created.
     * @param lastUpdated Moment the entity was last updated.
     */
    public constructor(id: string, title: string, content: string, created: Date, lastUpdated: Date) {
        super(id);

        this.title = title;
        this.content = content;
        this.created = created;
        this.lastUpdated = lastUpdated;
    }

    /**
     * Produce a note instance with the given title.
     *
     * @param title Arbitrary title.
     * @return Note instance with the given title.
     */
    public withTitle(title: string): Note {
        if (title === this.title) {
            return this;
        }

        return new Note(this.id, title, this.content, this.created, this.lastUpdated);
    }

    /**
     * Produce a note instance with the given content.
     *
     * @param content Arbitrary content.
     * @return Note instance with the given content.
     */
    public withContent(content: string): Note {
        if (content === this.content) {
            return this;
        }

        return new Note(this.id, this.title, content, this.created, this.lastUpdated);
    }

    /**
     * Produce a note instance last updated at the given moment.
     *
     * @param moment Arbitrary moment in time.
     * @return Note instance last updated at the given moment.
     */
    public lastUpdatedAt(moment: Date): Note {
        if (moment.getTime() === this.lastUpdated.getTime()) {
            return this;
        }

        return new Note(this.id, this.title, this.content, this.created, moment);
    }

    /**
     * Produce a JSON representation of this entity.
     *
     * @return JSON representation.
     */
    public toJSON(): any {
        return {
            ...super.toJSON(),

            title: this.title,
            content: this.content,
            created: this.created.toISOString(),
            lastUpdated: this.lastUpdated.toISOString()
        };
    }
}

export default Note;
