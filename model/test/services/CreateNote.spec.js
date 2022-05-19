import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { CreateNote } from "@notes/model/services";
import { DuplicateEntityError } from "@notes/model/datamappers";
import { Note } from "@notes/model/entities";
import { NoteEvent } from "@notes/model/events";
import { ValidatorError } from "@moonwalkingbits/apollo/validation";
import { spy, stub } from "sinon";
import { validate } from "uuid";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("CreateNote", () => {
    let dataMapperMock;
    let validatorMock;
    let dispatcher;
    let createNote;

    beforeEach(() => {
        dataMapperMock = stub({insert: () => void 0});
        validatorMock = spy({validate: () => void 0});
        dispatcher = spy({dispatch: () => void 0});
        createNote = new CreateNote(dataMapperMock, validatorMock, dispatcher);
    });

    describe("#fromObject", () => {
        it("should create note from valid object", async () => {
            const object = {
                id: "id",
                title: "title",
                content: "content"
            };
            const note = await createNote.fromObject(object);

            expect(note).to.be.instanceof(Note);
        });

        it("should insert note into storage layer", async () => {
            const object = {
                id: "id",
                title: "title",
                content: "content"
            };
            const note = await createNote.fromObject(object);

            expect(dataMapperMock.insert.calledOnce).to.be.true;
            expect(dataMapperMock.insert.firstCall.firstArg).to.equal(note);
        });

        it("should dispatch created event", async () => {
            const object = {
                id: "id",
                title: "title",
                content: "content"
            };
            const note = await createNote.fromObject(object);

            expect(dispatcher.dispatch.calledOnce).to.be.true;
            expect(dispatcher.dispatch.firstCall.firstArg).to.equal("note:created");
            expect(dispatcher.dispatch.firstCall.args[1]).to.be.instanceof(NoteEvent);
            expect(dispatcher.dispatch.firstCall.args[1].payload).to.equal(note);
        });

        it("should provide unique identifier", async () => {
            const object = {
                title: "title",
                content: "content"
            };
            const note = await createNote.fromObject(object);

            expect(validate(note.id)).to.be.true;
        });

        it("should throw validator error if creating duplicate note", async () => {
            const object = {
                id: "id",
                title: "title",
                content: "content"
            };

            dataMapperMock.insert.throws(new DuplicateEntityError("id"));

            await expect(createNote.fromObject(object)).to.eventually.be.rejectedWith(ValidatorError);
        });

        it("should rethrow other errors", async () => {
            const object = {
                id: "id",
                title: "title",
                content: "content"
            };

            dataMapperMock.insert.throws(new Error());

            await expect(createNote.fromObject(object)).to.eventually.be.rejectedWith(Error);
        });
    });
});
