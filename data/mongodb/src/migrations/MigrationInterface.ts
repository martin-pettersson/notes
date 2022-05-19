import { Db } from "mongodb";

/**
 * Has the ability to apply structural changes to a database.
 */
interface MigrationInterface {
    /**
     * Apply migration to the database of a given connection.
     *
     * @param connection Database connection instance.
     * @return Promise resolving when the operation is done.
     */
    apply(connection: Db): Promise<void>;
}

export default MigrationInterface;
