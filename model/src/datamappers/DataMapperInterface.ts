import { AbstractEntity } from "@notes/model/entities";

/**
 * Has the ability to manipulate entities in the storage layer.
 */
interface DataMapperInterface<T extends AbstractEntity> {
    /**
     * Retrieve an entity with matching id.
     *
     * @param id Unique identifier.
     * @return Promise resolving with an entity instance if found.
     */
    get(id: string): Promise<T | null>;

    /**
     * Insert a given entity into storage.
     *
     * @param entity Arbitrary entity instance.
     * @return Promise resolving when the operation is done.
     * @throws DuplicateEntityError When attempting to insert a duplicate entity.
     */
    insert(entity: T): Promise<void>;

    /**
     * Update a given entity in storage.
     *
     * @param entity Arbitrary entity instance.
     * @return Promise resolving when the operation is done.
     * @throws EntityNotFoundError When the given entity cannot be found in storage.
     */
    update(entity: T): Promise<void>;

    /**
     * Remove a given entity from storage.
     *
     * @param entity Arbitrary entity instance.
     * @return Promise resolving when the operation is done.
     */
    delete(entity: T): Promise<void>;
}

export default DataMapperInterface;
