import { AbstractPaginatedCriteria } from "@notes/model/repositories";
import { expect } from "chai";

describe("AbstractPaginatedCriteria", () => {
    let criteria;

    beforeEach(() => {
        criteria = new AbstractPaginatedCriteria(0, 100);
    });

    describe("#constructor", () => {
        it("should accept constructor parameters", () => {
            expect(criteria.offset).to.equal(0);
            expect(criteria.limit).to.equal(100);
        });
    });

    describe("#onPage", () => {
        it("should use given page", () => {
            expect(criteria.onPage(2).offset).to.equal(100);
        });

        it("should never produce negative offsets", () => {
            expect(criteria.onPage(-2).offset).to.equal(0);
        });
    });

    describe("#withPageSize", () => {
        it("should use given page size", () => {
            expect(criteria.withPageSize(10).limit).to.equal(10);
        });

        it("should preserve page when updating page size", () => {
            expect(criteria.withPageSize(10).offset).to.equal(0);
            expect(criteria.onPage(2).withPageSize(10).offset).to.equal(10);
        });

        it("should use previous offset if page size is zero", () => {
            expect(criteria.withPageSize(0).withPageSize(10).offset).to.equal(0);
        });

        it("should never produce negative limits", () => {
            expect(criteria.withPageSize(-2).limit).to.equal(0);
        });
    });
});
