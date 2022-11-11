import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { NoteCriteria } from "@notes/model/repositories";
import { NoteStrategy } from "@notes/data-rest/repositories";
import { Readable } from "stream";
import { stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("NoteStrategy", () => {
    let noteMock;
    let url;
    let fetchMock;
    let criteriaMock;
    let strategy;

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
        criteriaMock = stub({isSatisfiedBy: () => void 0});
        strategy = new NoteStrategy(url, fetchMock);
    });

    describe("#matching", () => {
        it("should return matching entities", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify([noteMock]))));

            expect(
                JSON.stringify(Array.from(await strategy.matching(NoteCriteria.fromParameters({q: "title"}))))
            ).to.eql(JSON.stringify([noteMock]));
            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes?q=title&page=1&page_size=10`);
        });

        it("should return matching entities on given page", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify([noteMock]))));

            await strategy.matching(new NoteCriteria().onPage(2));

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes?page=2&page_size=10`);
        });

        it("should return matching entities with given page size", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify([noteMock]))));

            await strategy.matching(new NoteCriteria().withPageSize(20));

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes?page=1&page_size=20`);
        });

        it("should accept generic criteria", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify([noteMock]))));

            await strategy.matching(criteriaMock);

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes`);
            expect(criteriaMock.isSatisfiedBy.calledOnce).to.be.true;
        });

        it("should accept generic paginated criteria", async () => {
            fetchMock.returns(new Response(Readable.from(JSON.stringify([noteMock]))));

            await strategy.matching({isSatisfiedBy: () => true, offset: 10, limit: 10});

            expect(fetchMock.calledOnce).to.be.true;
            expect(fetchMock.firstCall.args[0].toString()).to.equal(`${url}v1/notes?page=2&page_size=10`);
        });

        it("should throw if request fails", async () => {
            fetchMock.returns(new Response(null, {status: 500}));

            await expect(strategy.matching(new NoteCriteria())).to.eventually.be.rejectedWith(Error);
        });
    });
});
