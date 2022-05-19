import { AbstractEntity } from "@notes/model/entities";
import { DataMapperInterface, DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";

/**
 * An in-memory implementation of a generic data mapper.
 */
class DataMapper<T extends AbstractEntity> implements DataMapperInterface<T>{
    /**
     * Entity storage.
     */
    private readonly entities: Map<string, T>;

    /**
     * Create a new generic data mapper instance.
     *
     * @param entities Entity storage.
     */
    public constructor(entities: Map<string, T> = new Map()) {
        this.entities = entities;
    }

    /** @inheritDoc */
    public async get(id: string): Promise<T | null> {
        return this.entities.get(id) ?? null;
    }

    /** @inheritDoc */
    public async insert(entity: T): Promise<void> {
        if (this.entities.has(entity.id)) {
            throw new DuplicateEntityError("id");
        }

        this.entities.set(entity.id, entity);
    }

    /** @inheritDoc */
    public async update(entity: T): Promise<void> {
        if (!this.entities.has(entity.id)) {
            throw new EntityNotFoundError(entity.id);
        }

        this.entities.set(entity.id, entity);
    }

    /** @inheritDoc */
    public async delete(entity: T): Promise<void> {
        this.entities.delete(entity.id);
    }
}

export default DataMapper;
