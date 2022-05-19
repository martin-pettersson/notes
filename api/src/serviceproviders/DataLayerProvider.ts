import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { DataMapper as MemoryDataMapper } from "@notes/data-memory/datamappers";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { MigrationManager } from "@notes/data-mongodb/migrations";
import { MongoClient } from "mongodb";
import { NoteDataMapper as NoteMongoDbDataMapper } from "@notes/data-mongodb/datamappers";
import { NoteStrategy as NoteMongoDbStrategy } from "@notes/data-mongodb/repositories";
import { Repository } from "@notes/model/repositories";
import { ServiceProviderInterface } from "@notes/api/serviceproviders";
import { Strategy as MemoryStrategy } from "@notes/data-memory/repositories";

/**
 * Provides a data layer to the application.
 */
class DataLayerProvider implements ServiceProviderInterface {
    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new data layer provider instance.
     *
     * @param configuration Application configuration.
     * @param logger Application logger.
     */
    public constructor(configuration: ConfigurationInterface, logger: LoggerInterface) {
        this.configuration = configuration;
        this.logger = logger;
    }

    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(container: ContainerInterface): Promise<void> {
        const strategy = this.configuration.get("dataLayer.strategy", "memory") as string;

        switch (strategy) {
            case "memory":
                this.useMemoryStrategy(container);
                break;
            case "mongodb":
                await this.useMongoDbStrategy(container);
                break;
            default:
                throw new Error(`Unknown data layer strategy: ${strategy}`);
        }
    }

    /**
     * Register memory specific data layer bindings.
     *
     * @param container Application container.
     */
    private useMemoryStrategy(container: ContainerInterface): void {
        this.logger.info("Using memory data layer strategy");

        const notes = new Map();

        container.bindFactory("noteStrategy", () => new MemoryStrategy(notes));
        container.bindFactory("noteRepository", noteStrategy => new Repository(noteStrategy));
        container.bindFactory("noteDataMapper", () => new MemoryDataMapper(notes));
    }

    /**
     * Register MongoDB specific data layer bindings.
     *
     * @param container Application container.
     * @return Promise resolving when the operation is done.
     */
    private async useMongoDbStrategy(container: ContainerInterface): Promise<void> {
        this.logger.info("Using MongoDB data layer strategy");

        const { host, authSource, database, user, password } = this.configuration.get("mongoDb", {}) as any;
        const client = await new MongoClient(process.env.MONGO_HOST ?? host, {
            authSource: process.env.MONGO_AUTH_SOURCE ?? authSource,
            auth: {
                username: process.env.MONGO_USER ?? user,
                password: process.env.MONGO_PASSWORD ?? password,
            }
        }).connect();
        const connection = client.db(process.env.MONGO_DATABASE ?? database);

        this.logger.info("Applying database migrations");

        await new MigrationManager(connection).migrate();

        container.bindFactory("noteStrategy", () => new NoteMongoDbStrategy(connection));
        container.bindFactory("noteRepository", noteStrategy => new Repository(noteStrategy));
        container.bindFactory("noteDataMapper", () => new NoteMongoDbDataMapper(connection));
    }
}

export default DataLayerProvider;
