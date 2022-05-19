/**
 * Error used to indicate an attempt to create a duplicate entity.
 */
class DuplicateEntityError extends Error {
    /**
     * Violated entity property.
     */
    public readonly property: string;

    /**
     * Create a new error instance.
     *
     * @param property Violated entity property.
     * @param message Arbitrary error message.
     */
    public constructor(property: string, message?: string) {
        super(message ?? `Property "${property}" must be unique`);

        this.property = property;
    }
}

export default DuplicateEntityError;
