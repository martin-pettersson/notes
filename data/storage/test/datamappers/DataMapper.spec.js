import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { DataMapper } from "@notes/data-storage/datamappers";
import { DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";
import { mock, stub } from "sinon";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("DataMapper", () => {
    const key = "entities";
    let entityMock;
    let storageMock;
    let entityFactoryMock;
    let dataMapper;

    beforeEach(() => {
        entityMock = {id: "id", title: "title", content: "content"};
        storageMock = stub({getItem: () => void 0, setItem: () => void 0});
        entityFactoryMock = mock();
        dataMapper = new DataMapper(storageMock, key, entityFactoryMock);

        storageMock.getItem.returns(JSON.stringify({[entityMock.id]: entityMock}));
        entityFactoryMock.returns(Symbol.for(entityMock.id));
    });

    describe("#get", () => {
        it("should return entity by id", async () => {
            expect(await dataMapper.get(entityMock.id)).to.equal(Symbol.for(entityMock.id));
        });

        it("should return null if not found", async () => {
            expect(await dataMapper.get("non-existent")).to.be.null;
        });
    });

    describe("#insert", () => {
        it("should insert entity into storage", async () => {
            storageMock.getItem.returns(null);

            await dataMapper.insert(entityMock);

            expect(storageMock.setItem.calledOnce).to.be.true;
            expect(storageMock.setItem.firstCall.args[0]).to.equal(key);
            expect(storageMock.setItem.firstCall.args[1]).to.eql(JSON.stringify({[entityMock.id]: entityMock}));
        });

        it("should throw if duplicate id", async () => {
            storageMock.getItem.returns(JSON.stringify({[entityMock.id]: entityMock}));

            await expect(dataMapper.insert(entityMock)).to.eventually.be.rejectedWith(DuplicateEntityError);
        });
    });

    describe("#update", () => {
        it("should update entity in storage", async () => {
            const title = "new title";
            const updatedEntityMock = {...entityMock, title};

            storageMock.getItem.returns(JSON.stringify({[entityMock.id]: entityMock}));

            await dataMapper.update(updatedEntityMock);

            expect(storageMock.setItem.calledOnce).to.be.true;
            expect(storageMock.setItem.firstCall.args[0]).to.equal(key);
            expect(storageMock.setItem.firstCall.args[1]).to.eql(JSON.stringify({[entityMock.id]: updatedEntityMock}));
        });

        it("should throw if not found", async () => {
            storageMock.getItem.returns(null);

            await expect(dataMapper.update({id: "non-existent"})).to.eventually.be.rejectedWith(EntityNotFoundError);
        });
    });

    describe("#delete", () => {
        it("should remove entity from storage", async () => {
            storageMock.getItem.returns(JSON.stringify({[entityMock.id]: entityMock}));

            await dataMapper.delete(entityMock);

            expect(storageMock.setItem.calledOnce).to.be.true;
            expect(storageMock.setItem.firstCall.args[0]).to.equal(key);
            expect(storageMock.setItem.firstCall.args[1]).to.equal("{}");
        });

        it("should not throw if not found", async () => {
            storageMock.getItem.returns(null);

            await dataMapper.delete({id: "non-existent"});
        });
    });
});
