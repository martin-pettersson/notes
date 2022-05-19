import { AbstractEntity } from "@notes/model/entities";
import { CriteriaInterface, RepositoryInterface, StrategyInterface } from "@notes/model/repositories/index";

/**
 * A generic repository implementation.
 */
class Repository<T extends AbstractEntity> implements RepositoryInterface<T> {
    /**
     * Strategy instance.
     */
    private readonly strategy: StrategyInterface<T>;

    /**
     * Create a new repository instance.
     *
     * @param strategy Strategy instance.
     */
    public constructor(strategy: StrategyInterface<T>) {
        this.strategy = strategy;
    }
    
    /** @inheritDoc */
    public matching(criteria: CriteriaInterface<T>, signal?: AbortSignal): Promise<Set<T>> {
        return this.strategy.matching(criteria, signal);
    }
}

export default Repository;
