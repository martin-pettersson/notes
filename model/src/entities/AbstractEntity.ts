/**
 * Represents an arbitrary system entity.
 */
abstract class AbstractEntity {
    /**
     * Unique identifier.
     */
    public readonly id: string;

    /**
     * Create a new entity instance.
     *
     * @param id Unique identifier.
     */
    protected constructor(id: string) {
        this.id = id;
    }

    /**
     * Produce a JSON representation of this entity.
     *
     * @return JSON representation.
     */
    public toJSON(): any {
        return {
            id: this.id
        };
    }
}

export default AbstractEntity;
