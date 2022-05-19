import { AbstractEntity } from "@notes/model/entities";

/**
 * Has the ability to access entities in browser storage.
 */
abstract class AbstractEntityAccessor<T extends AbstractEntity> {
    /**
     * Browser storage implementation.
     */
    protected readonly storage: Storage;

    /**
     * Storage key.
     */
    protected readonly key: string;

    /**
     * Entity factory used for deserializing entities.
     */
    protected readonly entityFactory: (entityObject: any) => T;

    /**
     * Create a new generic data mapper instance.
     *
     * @param storage Browser storage implementation.
     * @param key Storage key.
     * @param entityFactory Entity factory used for deserializing entities.
     */
    public constructor(storage: Storage, key: string, entityFactory: (entityObject: any) => T) {
        this.storage = storage;
        this.key = key;
        this.entityFactory = entityFactory;
    }

    /**
     * Entities in storage.
     *
     * @return Entities in storage.
     */
    protected get entities(): Map<string, T> {
        const entities = JSON.parse(this.storage.getItem(this.key) ?? "{}") as Map<string, any>;

        return new Map(
            Object.entries(entities)
                .map(([id, entity]) => [id, this.entityFactory(entity)])
        );
    }

    /**
     * Entities in storage.
     */
    protected set entities(entities: Map<string, T>) {
        this.storage.setItem(this.key, JSON.stringify(Object.fromEntries(entities.entries())));
    }
}

export default AbstractEntityAccessor;
