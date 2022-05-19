import { AbstractEntity } from "@notes/model/entities";
import { AbstractEntityAccessor } from "@notes/data-storage";
import { DataMapperInterface, DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";

/**
 * An browser storage implementation of a generic data mapper.
 */
class DataMapper<T extends AbstractEntity> extends AbstractEntityAccessor<T> implements DataMapperInterface<T> {
    /** @inheritDoc */
    public async get(id: string): Promise<T | null> {
        return this.entities.get(id) ?? null;
    }

    /** @inheritDoc */
    public async insert(entity: T): Promise<void> {
        const entities = this.entities;

        if (entities.has(entity.id)) {
            throw new DuplicateEntityError("id");
        }

        entities.set(entity.id, entity);

        this.entities = entities;
    }

    /** @inheritDoc */
    public async update(entity: T): Promise<void> {
        const entities = this.entities;

        if (!entities.has(entity.id)) {
            throw new EntityNotFoundError(entity.id);
        }

        entities.set(entity.id, entity);

        this.entities = entities;
    }

    /** @inheritDoc */
    public async delete(entity: T): Promise<void> {
        const entities = this.entities;

        entities.delete(entity.id);

        this.entities = entities;
    }
}

export default DataMapper;
