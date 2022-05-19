/**
 * Has the ability to apply migrations to a database.
 */
interface MigrationManagerInterface {
    /**
     * Apply migration operations to the database.
     *
     * @return Promise resolving when the operation is done.
     */
    migrate(): Promise<void>;
}

export default MigrationManagerInterface;
