import { Strategy } from "@notes/data-storage/repositories";
import { expect } from "chai";
import { stub } from "sinon";

describe("Strategy", () => {
    const entityOne = {id: "one"};
    const entityTwo = {id: "two"};
    const entityThree = {id: "three"};
    const key = "entities";
    let storageMock;
    let entityFactoryMock;
    let criteriaMock;
    let strategy;

    beforeEach(() => {
        criteriaMock = stub({isSatisfiedBy: () => void 0});
        storageMock = stub({getItem: () => void 0, setItem: () => void 0});
        entityFactoryMock = entity => entity.id;
        strategy = new Strategy(storageMock, key, entityFactoryMock);

        criteriaMock.isSatisfiedBy.returns(true);
        storageMock.getItem.returns(JSON.stringify({
            [entityOne.id]: entityOne,
            [entityTwo.id]: entityTwo,
            [entityThree.id]: entityThree
        }));
    });

    describe("#matching", () => {
        it("should return matching entities", async () => {
            criteriaMock.isSatisfiedBy
                .onFirstCall().returns(true)
                .onSecondCall().returns(true)
                .onThirdCall().returns(false);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityOne.id, entityTwo.id]));
        });

        it("should return matching entities on given page", async () => {
            const criteriaMock = stub({
                isSatisfiedBy: () => void 0,
                offset: 1,
                limit: 10
            });

            criteriaMock.isSatisfiedBy.returns(true);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityTwo.id, entityThree.id]));
        });

        it("should return matching entities with given page size", async () => {
            const criteriaMock = stub({
                isSatisfiedBy: () => void 0,
                offset: 0,
                limit: 1
            });

            criteriaMock.isSatisfiedBy.returns(true);

            expect(await strategy.matching(criteriaMock)).to.eql(new Set([entityOne.id]));
        });
    });
});
