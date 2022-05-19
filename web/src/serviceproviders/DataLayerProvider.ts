import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { DataMapper as MemoryDataMapper } from "@notes/data-memory/datamappers";
import { DataMapper as StorageDataMapper } from "@notes/data-storage/datamappers";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { Note } from "@notes/model/entities";
import { NoteDataMapper as NoteRestDataMapper } from "@notes/data-rest/datamappers";
import { NoteStrategy as NoteRestStrategy } from "@notes/data-rest/repositories";
import { Repository } from "@notes/model/repositories";
import { ServiceProviderInterface } from "@notes/web/serviceproviders";
import { Strategy as MemoryStrategy } from "@notes/data-memory/repositories";
import { Strategy as StorageStrategy } from "@notes/data-storage/repositories";

/**
 * Provides a data layer to the application.
 */
class DataLayerProvider implements ServiceProviderInterface {
    /**
     * Create note entity instance from the given object.
     *
     * @param object Arbitrary note object representation.
     * @return Note entity instance.
     */
    private static noteFrom(object: any): Note {
        return new Note(
            object.id,
            object.title,
            object.content,
            new Date(object.created),
            new Date(object.lastUpdated)
        );
    }

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
            case "session-storage":
                this.useSessionStorageStrategy(container);
                break;
            case "local-storage":
                this.useLocalStorageStrategy(container);
                break;
            case "rest":
                this.useRestStrategy(container);
                break;
            default:
                throw new Error(`Unknown data layer strategy: ${strategy}`);
        }

        container.bindFactory("noteRepository", noteStrategy => new Repository(noteStrategy));
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
        container.bindFactory("noteDataMapper", () => new MemoryDataMapper(notes));
    }

    /**
     * Register browser session storage specific data layer bindings.
     *
     * @param container Application container.
     */
    private useSessionStorageStrategy(container: ContainerInterface): void {
        this.logger.info("Using session storage data layer strategy");

        this.useStorageStrategy(container, sessionStorage);
    }

    /**
     * Register browser local storage specific data layer bindings.
     *
     * @param container Application container.
     */
    private useLocalStorageStrategy(container: ContainerInterface): void {
        this.logger.info("Using local storage data layer strategy");

        this.useStorageStrategy(container, localStorage);
    }

    /**
     * Register browser storage specific data layer bindings.
     *
     * @param container Application container.
     * @param storage Browser storage implementation.
     */
    private useStorageStrategy(container: ContainerInterface, storage: Storage): void {
        const prefix = this.configuration.get("dataLayer.storage.prefix", "notes");

        container.bindFactory(
            "noteStrategy",
            () => new StorageStrategy(storage, `${prefix}.notes`, DataLayerProvider.noteFrom)
        );
        container.bindFactory(
            "noteDataMapper",
            () => new StorageDataMapper(storage, `${prefix}.notes`, DataLayerProvider.noteFrom)
        );
    }

    /**
     * Register REST specific data layer bindings.
     *
     * @param container Application container.
     */
    private useRestStrategy(container: ContainerInterface): void {
        this.logger.info("Using REST data layer strategy");

        let url: URL;

        try {
            url = new URL(this.configuration.get("dataLayer.rest.url"));
        } catch (error) {
            this.logger.error("Invalid API URL: {url}", {url: this.configuration.get("dataLayer.rest.url")});

            throw error;
        }

        container.bindFactory("noteStrategy", () => new NoteRestStrategy(url, fetch.bind(window)));
        container.bindFactory("noteDataMapper", () => new NoteRestDataMapper(url, fetch.bind(window)));
    }
}

export default DataLayerProvider;
