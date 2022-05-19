import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { Note } from "@notes/model/entities";
import { NoteUpdatedEvent } from "@notes/model/events";
import { PatchNote } from "@notes/model/services";
import { spy, stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("PatchNote", () => {
    let dataMapperMock;
    let validatorMock;
    let dispatcher;
    let patchNote;
    let note;

    beforeEach(() => {
        dataMapperMock = stub({update: () => void 0});
        validatorMock = spy({validate: () => void 0});
        dispatcher = spy({dispatch: () => void 0});
        patchNote = new PatchNote(dataMapperMock, validatorMock, dispatcher);
        note = new Note("id", "title", "content", new Date(Date.UTC(2020)), new Date(Date.UTC(2020, 2)));
    });

    describe("#withObject", () => {
        it("should patch note with empty object", async () => {
            const object = {};
            const patchedNote = await patchNote.withObject(note, object);

            expect(patchedNote.title).to.equal(note.title);
            expect(patchedNote.content).to.equal(note.content);
            expect(patchedNote.lastUpdated.getTime()).to.be.approximately(new Date().getTime(), 5_000);
        });

        it("should patch note with partial object", async () => {
            const object = {
                title: "new title"
            };
            const patchedNote = await patchNote.withObject(note, object);

            expect(patchedNote.title).to.equal(object.title);
            expect(patchedNote.content).to.equal(note.content);
            expect(patchedNote.lastUpdated.getTime()).to.be.approximately(new Date().getTime(), 5_000);
        });

        it("should patch note with complete object", async () => {
            const object = {
                title: "new title",
                content: "new content"
            };
            const patchedNote = await patchNote.withObject(note, object);

            expect(patchedNote.title).to.equal(object.title);
            expect(patchedNote.content).to.equal(object.content);
            expect(patchedNote.lastUpdated.getTime()).to.be.approximately(new Date().getTime(), 5_000);
        });

        it("should update note in data layer", async () => {
            const object = {};
            const patchedNote = await patchNote.withObject(note, object);

            expect(dataMapperMock.update.calledOnce).to.be.true;
            expect(dataMapperMock.update.firstCall.firstArg).to.equal(patchedNote);
        });

        it("should dispatch updated event", async () => {
            const object = {};
            const patchedNote = await patchNote.withObject(note, object);

            expect(dispatcher.dispatch.calledOnce).to.be.true;
            expect(dispatcher.dispatch.firstCall.firstArg).to.equal("note:updated");
            expect(dispatcher.dispatch.firstCall.args[1]).to.be.instanceof(NoteUpdatedEvent);
            expect(dispatcher.dispatch.firstCall.args[1].payload[0]).to.equal(patchedNote);
            expect(dispatcher.dispatch.firstCall.args[1].payload[1]).to.equal(note);
        });
    });
});
