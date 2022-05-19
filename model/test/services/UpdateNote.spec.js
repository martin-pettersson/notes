import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { Note } from "@notes/model/entities";
import { NoteUpdatedEvent } from "@notes/model/events";
import { UpdateNote } from "@notes/model/services";
import { spy, stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("UpdateNote", () => {
    let dataMapperMock;
    let validatorMock;
    let dispatcher;
    let updateNote;
    let note;

    beforeEach(() => {
        dataMapperMock = stub({update: () => void 0});
        validatorMock = spy({validate: () => void 0});
        dispatcher = spy({dispatch: () => void 0});
        updateNote = new UpdateNote(dataMapperMock, validatorMock, dispatcher);
        note = new Note("id", "title", "content", new Date(), new Date());
    });

    describe("#withObject", () => {
        it("should update note with valid object", async () => {
            const object = {
                id: "id",
                title: "new title",
                content: "new content"
            };
            const updatedNote = await updateNote.withObject(note, object);

            expect(updatedNote.title).to.equal(object.title);
            expect(updatedNote.content).to.equal(object.content);
            expect(updatedNote.lastUpdated.getTime()).to.be.approximately(new Date().getTime(), 5_000);
        });

        it("should update note in data layer", async () => {
            const object = {
                id: "id",
                title: "new title",
                content: "new content"
            };
            const updatedNote = await updateNote.withObject(note, object);

            expect(dataMapperMock.update.calledOnce).to.be.true;
            expect(dataMapperMock.update.firstCall.firstArg).to.equal(updatedNote);
        });

        it("should dispatch update event", async () => {
            const object = {
                id: "id",
                title: "new title",
                content: "new content"
            };
            const updatedNote = await updateNote.withObject(note, object);

            expect(dispatcher.dispatch.calledOnce).to.be.true;
            expect(dispatcher.dispatch.firstCall.firstArg).to.equal("note:updated");
            expect(dispatcher.dispatch.firstCall.args[1]).to.be.instanceof(NoteUpdatedEvent);
            expect(dispatcher.dispatch.firstCall.args[1].payload[0]).to.equal(updatedNote);
            expect(dispatcher.dispatch.firstCall.args[1].payload[1]).to.equal(note);
        });
    });
});
