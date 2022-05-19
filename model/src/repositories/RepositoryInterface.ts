import { AbstractEntity } from "@notes/model/entities";
import { CriteriaInterface } from "@notes/model/repositories/index";

/**
 * Represents a collection of entities.
 */
interface RepositoryInterface<T extends AbstractEntity> {
    /**
     * Retrieve entities matching the given criteria.
     *
     * @param criteria Arbitrary criteria to match entities against.
     * @param signal Abort signal indicating whether to abort the operation.
     * @return Promise resolving with a set of matching entities.
     */
    matching(criteria: CriteriaInterface<T>, signal?: AbortSignal): Promise<Set<T>>;
}

export default RepositoryInterface;
