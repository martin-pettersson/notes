/**
 * Error used to indicate the absence of an expected entity.
 */
class EntityNotFoundError extends Error {
    /**
     * Unique identifier.
     */
    public readonly id: string;

    /**
     * Create a new error instance.
     *
     * @param id Unique identifier.
     * @param message Arbitrary error message.
     */
    public constructor(id: string, message?: string) {
        super(message ?? `No matching entity found with id: ${id}`);

        this.id = id;
    }
}

export default EntityNotFoundError;
