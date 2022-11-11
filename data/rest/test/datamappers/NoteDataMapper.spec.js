import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";
import { Note } from "@notes/model/entities";
import { NoteDataMapper } from "@notes/data-rest/datamappers";
import { Readable } from "stream";
import { stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("NoteDataMapper", () => {
    let noteMock;
    let url;
    let fetchMock;
    let dataMapper;

    beforeEach(() => {
        noteMock = {
            id: "id",
            title: "title",
            content: "content",
            created: "2020-01-01T00:00:00.000Z",
            lastUpdated: "2020-02-01T00:00:00.000Z"
        };
        url = new URL("http://localhost");
        fetchMock = stub();
        dataMapper = new NoteDataMapper(url, fetchMock);
    });

    describe("#get", () => {
        it("should return note by id", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify(noteMock))));

            const note = await dataMapper.get(noteMock.id);

            expect(note).to.be.instanceof(Note);
            expect(note.toJSON()).to.eql(noteMock);
        });

        it("should return null if not found", async () => {
            fetchMock.returns(new Response(null, {status: 404}));

            expect(await dataMapper.get(noteMock.id)).to.be.null;
        });

        it("should throw if request fails", async () => {
            fetchMock.returns(new Response(null, {status: 500}));

            await expect(dataMapper.get(noteMock.id)).to.eventually.be.rejectedWith(Error);
        });
    });

    describe("#insert", () => {
        it("should insert note into storage", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify(noteMock)), {status: 201}));

            await dataMapper.insert(noteMock);

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes`);
            expect(fetchMock.firstCall.args[1].method).to.equal("POST");
            expect(fetchMock.firstCall.args[1].body).to.equal(JSON.stringify(noteMock));
        });

        it("should throw if duplicate id", async () => {
            fetchMock.returns(
                new Response(
                    Readable.from(JSON.stringify({id: ["Must be unique"]})),
                    {status: 422}
                )
            );

            await expect(dataMapper.insert(noteMock)).to.eventually.be.rejectedWith(DuplicateEntityError);
        });

        it("should throw if invalid note", async () => {
            fetchMock.returns(
                new Response(
                    Readable.from(JSON.stringify({id: ["Must be a valid UUID"]})),
                    {status: 422}
                )
            );

            await expect(dataMapper.insert(noteMock)).to.eventually.be.rejectedWith(Error);
        });

        it("should throw if request fails", async () => {
            fetchMock.returns(new Response(null, {status: 500}));

            await expect(dataMapper.insert(noteMock)).to.eventually.be.rejectedWith(Error);
        });
    });

    describe("#update", () => {
        it("should update note in storage", async () => {
            fetchMock.returns(new Response(null, {status: 204}));

            await dataMapper.update(noteMock);

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes/${noteMock.id}`);
            expect(fetchMock.firstCall.args[1].method).to.equal("PUT");
            expect(fetchMock.firstCall.args[1].body).to.equal(JSON.stringify(noteMock));
        });

        it("should throw if not found", async () => {
            fetchMock.returns(new Response(null, {status: 404}));

            await expect(dataMapper.update(noteMock)).to.eventually.be.rejectedWith(EntityNotFoundError);
        });

        it("should throw if request fails", async () => {
            fetchMock.returns(new Response(null, {status: 500}));

            await expect(dataMapper.update(noteMock)).to.eventually.be.rejectedWith(Error);
        });
    });

    describe("#delete", () => {
        it("should remove note from storage", async () => {
            fetchMock.returns(new Response(null, {status: 204}));

            await dataMapper.delete(noteMock);

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes/${noteMock.id}`);
            expect(fetchMock.firstCall.args[1].method).to.equal("DELETE");
        });

        it("should not throw if not found", async () => {
            fetchMock.returns(new Response(null, {status: 404}));

            await dataMapper.delete({id: "non-existent"});
        });

        it("should throw if request fails", async () => {
            fetchMock.returns(new Response(null, {status: 500}));

            await expect(dataMapper.delete(noteMock)).to.eventually.be.rejectedWith(Error);
        });
    });
});
