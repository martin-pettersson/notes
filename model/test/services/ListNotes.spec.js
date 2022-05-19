import { ListNotes } from "@notes/model/services";
import { NoteCriteria } from "@notes/model/repositories";
import { expect } from "chai";
import { spy } from "sinon";

describe("ListNotes", () => {
    let repositoryMock;
    let listNotes;

    beforeEach(() => {
        repositoryMock = spy({matching: () => Promise.resolve(new Set())});
        listNotes = new ListNotes(repositoryMock);
    });

    describe("#matching", () => {
        it("should delegate to repository", async () => {
            const parameters = {};

            expect(await listNotes.matching(parameters)).to.be.empty;
            expect(repositoryMock.matching.calledOnce).to.be.true;
            expect(repositoryMock.matching.firstCall.firstArg).to.be.instanceof(NoteCriteria);
        });
    });
});
