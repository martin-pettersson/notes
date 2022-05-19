import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { DeleteNote } from "@notes/model/services";
import { NoteEvent } from "@notes/model/events";
import { spy } from "sinon/pkg/sinon-esm.js";
import { stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("DeleteNote", () => {
    let dataMapperMock;
    let dispatcher;
    let deleteNote;

    beforeEach(() => {
        dataMapperMock = stub({delete: () => void 0});
        dispatcher = spy({dispatch: () => void 0});
        deleteNote = new DeleteNote(dataMapperMock, dispatcher);
    });

    describe("#byReference", () => {
        it("should remove given note from data layer", async () => {
            const noteMock = {};

            await deleteNote.byReference(noteMock);

            expect(dataMapperMock.delete.calledOnce).to.be.true;
            expect(dataMapperMock.delete.firstCall.firstArg).to.equal(noteMock);
        });

        it("should dispatch note event", async () => {
            const noteMock = {};

            await deleteNote.byReference(noteMock);

            expect(dispatcher.dispatch.calledOnce).to.be.true;
            expect(dispatcher.dispatch.firstCall.firstArg).to.equal("note:deleted");
            expect(dispatcher.dispatch.firstCall.args[1]).to.be.instanceof(NoteEvent);
            expect(dispatcher.dispatch.firstCall.args[1].payload).to.equal(noteMock);
        });
    });
});
