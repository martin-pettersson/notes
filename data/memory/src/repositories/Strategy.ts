import { AbstractEntity } from "@notes/model/entities";
import { CriteriaInterface, RepositoryInterface, isPaginated } from "@notes/model/repositories";

/**
 * An in-memory implementation of a generic entity repository strategy.
 */
class Strategy<T extends AbstractEntity> implements RepositoryInterface<T> {
    /**
     * Entity storage.
     */
    private readonly entities: Map<string, T>;

    /**
     * Create a new generic repository strategy instance.
     *
     * @param entities Entity storage.
     */
    public constructor(entities: Map<string, T> = new Map()) {
        this.entities = entities;
    }

    /** @inheritDoc */
    public async matching(criteria: CriteriaInterface<T>): Promise<Set<T>> {
        const entities = Array.from(this.entities.values()).filter(criteria.isSatisfiedBy.bind(criteria));

        return new Set(isPaginated(criteria) ? entities.slice(criteria.offset, criteria.limit) : entities);
    }
}

export default Strategy;
