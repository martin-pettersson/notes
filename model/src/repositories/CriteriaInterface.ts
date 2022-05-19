import { AbstractEntity } from "@notes/model/entities";

/**
 * Represents criteria to match entities against.
 */
interface CriteriaInterface<T extends AbstractEntity> {
    /**
     * Determine if the given entity satisfies the criteria.
     *
     * @param entity Arbitrary entity instance.
     * @return True if the criteria are met.
     */
    isSatisfiedBy(entity: T): boolean;
}

export default CriteriaInterface;
