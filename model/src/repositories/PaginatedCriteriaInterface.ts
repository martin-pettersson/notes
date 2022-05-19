import { AbstractEntity } from "@notes/model/entities";
import { CriteriaInterface } from "@notes/model/repositories/index";

/**
 * Represents paginatable criteria to match entities against.
 */
interface PaginatedCriteriaInterface<T extends AbstractEntity> extends CriteriaInterface<T> {
    /**
     * Result page offset.
     */
    readonly offset: number;

    /**
     * Result page size.
     */
    readonly limit: number;

    /**
     * Configure criteria to offset by given page number.
     *
     * @param page Arbitrary page number.
     * @return Same instance for method chaining.
     */
    onPage(page: number): this;

    /**
     * Configure criteria to use given page size.
     *
     * @param size Arbitrary page size.
     * @return Same instance for method chaining.
     */
    withPageSize(size: number): this;
}

export default PaginatedCriteriaInterface;
