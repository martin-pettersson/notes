import CriteriaInterface from "./CriteriaInterface";
import PaginatedCriteriaInterface from "./PaginatedCriteriaInterface";
import { AbstractEntity } from "@notes/model/entities";

/**
 * Determine whether a given criteria is paginated.
 *
 * @param criteria Arbitrary criteria instance.
 * @return True if the criteria is paginated.
 */
function isPaginated<T extends AbstractEntity>(
    criteria: CriteriaInterface<T>
): criteria is PaginatedCriteriaInterface<T> {
    return "offset" in criteria && "limit" in criteria;
}

export { CriteriaInterface, PaginatedCriteriaInterface, isPaginated };
export { default as AbstractPaginatedCriteria } from "./AbstractPaginatedCriteria.js";
export { default as NoteCriteria } from "./NoteCriteria.js";
export { default as Repository } from "./Repository.js";
export { default as RepositoryInterface } from "./RepositoryInterface";
export { default as StrategyInterface } from "./StrategyInterface";
