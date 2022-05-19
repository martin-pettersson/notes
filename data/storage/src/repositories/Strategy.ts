import { AbstractEntity } from "@notes/model/entities";
import { AbstractEntityAccessor } from "@notes/data-storage";
import { CriteriaInterface, RepositoryInterface, isPaginated } from "@notes/model/repositories";

/**
 * A browser storage implementation of a generic entity repository strategy.
 */
class Strategy<T extends AbstractEntity> extends AbstractEntityAccessor<T> implements RepositoryInterface<T> {
    /** @inheritDoc */
    public async matching(criteria: CriteriaInterface<T>): Promise<Set<T>> {
        const entities = Array.from(this.entities.values()).filter(criteria.isSatisfiedBy.bind(criteria));

        return new Set(isPaginated(criteria) ? entities.slice(criteria.offset, criteria.limit) : entities);
    }
}

export default Strategy;
