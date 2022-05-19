import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { GetNote } from "@notes/model/services";
import { stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("GetNote", () => {
    let dataMapperMock;
    let getNote;

    beforeEach(() => {
        dataMapperMock = stub({get: () => void 0});
        getNote = new GetNote(dataMapperMock);
    });

    describe("#byId", () => {
        it("should retrieve note with matching id", async () => {
            const noteMock = {};

            dataMapperMock.get.returns(noteMock);

            const note = await getNote.byId("id");

            expect(note).to.equal(noteMock);
            expect(dataMapperMock.get.calledOnce).to.be.true;
            expect(dataMapperMock.get.firstCall.firstArg).to.equal("id");
        });
    });
});
