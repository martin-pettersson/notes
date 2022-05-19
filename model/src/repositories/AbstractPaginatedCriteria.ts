import { AbstractEntity } from "@notes/model/entities";
import { PaginatedCriteriaInterface } from "@notes/model/repositories";

/**
 * Represents paginatable criteria to match entities against.
 */
abstract class AbstractPaginatedCriteria<T extends AbstractEntity> implements PaginatedCriteriaInterface<T> {
    /**
     * Page number offset.
     */
    private _offset: number;

    /** @inheritDoc */
    public get offset(): number {
        return this._offset;
    }

    /**
     * Page size.
     */
    private _limit: number;

    /** @inheritDoc */
    public get limit(): number {
        return this._limit;
    };

    /**
     * Create a new paginatable criteria instance.
     *
     * @param offset Arbitrary offset.
     * @param limit Arbitrary page size.
     */
    protected constructor(offset: number, limit: number) {
        this._offset = offset;
        this._limit = limit;
    }

    /** @inheritDoc */
    public onPage(page: number): this {
        this._offset = Math.max(page - 1, 0) * this.limit;

        return this;
    }

    /** @inheritDoc */
    public withPageSize(limit: number): this {
        const oldPage = this.limit === 0 ? this.offset : this.offset / this.limit + 1;

        this._limit = Math.max(limit, 0);

        return this.onPage(oldPage);
    }

    /** @inheritDoc */
    public abstract isSatisfiedBy(entity: T): boolean;
}

export default AbstractPaginatedCriteria;
