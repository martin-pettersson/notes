import { Repository } from "@notes/model/repositories";
import { expect } from "chai";
import { spy } from "sinon";

describe("Repository", () => {
    let strategyMock;
    let criteriaMock;
    let repository;

    beforeEach(() => {
        strategyMock = spy({matching: () => Promise.resolve(new Set())});
        criteriaMock = {};
        repository = new Repository(strategyMock);
    });

    describe("#matching", () => {
        it("should delegate to strategy", async () => {
            expect(await repository.matching(criteriaMock)).to.be.empty;
            expect(strategyMock.matching.calledOnce).to.be.true;
            expect(strategyMock.matching.firstCall.firstArg).to.equal(criteriaMock);
        });
    });
});
