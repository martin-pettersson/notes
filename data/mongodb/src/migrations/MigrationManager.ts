import { Db } from "mongodb";
import { InitialSetup, MigrationManagerInterface } from "@notes/data-mongodb/migrations";

/**
 * Has the ability to apply structural changes to a database.
 */
class MigrationManager implements MigrationManagerInterface {
    /**
     * Set of migration operations to apply.
     */
    private static migrations = [
        InitialSetup
    ];

    /**
     * Database connection instance.
     */
    private readonly connection: Db;

    /**
     * Create a new migration manager instance.
     *
     * @param connection Database connection instance.
     */
    public constructor(connection: Db) {
        this.connection = connection;
    }

    /** @inheritDoc */
    public async migrate(): Promise<void> {
        for (const migration of MigrationManager.migrations) {
            await new migration().apply(this.connection);
        }
    }
}

export default MigrationManager;
