import { Db } from "mongodb";
import { MigrationInterface } from "@notes/data-mongodb/migrations";

/**
 * Provides operations to initially set up the database schemas.
 */
class InitialSetup implements MigrationInterface {
    /** @inheritDoc */
    public async apply(connection: Db): Promise<void> {
        try {
            await connection.collection("notes").createIndex({
                lastUpdated: -1
            });
        } catch (error) {
            if (error.code !== 11000) {
                throw error;
            }
        }
    }
}

export default InitialSetup;
