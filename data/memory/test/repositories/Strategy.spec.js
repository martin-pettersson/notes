import { Strategy } from "@notes/data-memory/repositories";
import { expect } from "chai";
import { stub } from "sinon";

describe("Strategy", () => {
    const entityOne = {id: "one"};
    const entityTwo = {id: "two"};
    const entityThree = {id: "three"};
    let criteriaMock;
    let strategy;

    beforeEach(() => {
        criteriaMock = stub({isSatisfiedBy: () => void 0});
        criteriaMock.isSatisfiedBy.returns(true);
        strategy = new Strategy(new Map([
            [entityOne.id, entityOne],
            [entityTwo.id, entityTwo],
            [entityThree.id, entityThree]
        ]));
    });

    describe("#constructor", () => {
        it("should be empty by default", async () => {
            expect(await new Strategy().matching(criteriaMock)).to.be.empty;
        });

        it("should accept entity storage", async () => {
            expect((await strategy.matching(criteriaMock)).size).to.equal(3);
        });
    });

    describe("#matching", () => {
        it("should return matching entities", async () => {
            criteriaMock.isSatisfiedBy
                .onFirstCall().returns(true)
                .onSecondCall().returns(true)
                .onThirdCall().returns(false);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityOne, entityTwo]));
        });

        it("should return matching entities on given page", async () => {
            const criteriaMock = stub({
                isSatisfiedBy: () => void 0,
                offset: 1,
                limit: 10
            });

            criteriaMock.isSatisfiedBy.returns(true);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityTwo, entityThree]));
        });

        it("should return matching entities with given page size", async () => {
            const criteriaMock = stub({
                isSatisfiedBy: () => void 0,
                offset: 0,
                limit: 1
            });

            criteriaMock.isSatisfiedBy.returns(true);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityOne]));
        });
    });
});
