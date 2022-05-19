import { AbstractEntityAccessor } from "@notes/data-storage";
import { expect } from "chai";
import { mock, stub } from "sinon";

describe("AbstractEntityAccessor", () => {
    const key = "entities";
    let entityMock;
    let storageMock;
    let entityFactoryMock;
    let entityAccessor;

    beforeEach(() => {
        entityMock = {id: "id", title: "title", content: "content"};
        storageMock = stub({getItem: () => void 0, setItem: () => void 0});
        entityFactoryMock = mock();
        entityAccessor = new AbstractEntityAccessor(storageMock, key, entityFactoryMock);

        storageMock.getItem.returns(JSON.stringify({[entityMock.id]: entityMock}));
        entityFactoryMock.returns(Symbol.for(entityMock.id));
    });

    describe("#get entities", () => {
        it("should retrieve entities if available", () => {
            const entities = entityAccessor.entities;

            expect(storageMock.getItem.calledOnce).to.be.true;
            expect(storageMock.getItem.firstCall.args[0]).to.equal(key);
            expect(entities.size).to.equal(1);
            expect(entities.has(entityMock.id)).to.be.true;
            expect(entities.get(entityMock.id)).to.eql(Symbol.for(entityMock.id));
            expect(entityFactoryMock.calledOnce).to.be.true;
            expect(entityFactoryMock.firstCall.firstArg).to.eql(entityMock);
        });

        it("should retrieve empty data structure if not available", () => {
            storageMock.getItem.returns(null);

            const entities = entityAccessor.entities;

            expect(entities.size).to.equal(0);
        });
    });

    describe("#set entities", () => {
        it("should set entity storage", () => {
            entityAccessor.entities = new Map([["id", "entity"]]);

            expect(storageMock.setItem.calledOnce).to.be.true;
            expect(storageMock.setItem.firstCall.args[0]).to.equal(key);
            expect(storageMock.setItem.firstCall.args[1]).to.equal('{"id":"entity"}');
        });

        it("should set empty entity storage", () => {
            entityAccessor.entities = new Map();

            expect(storageMock.setItem.calledOnce).to.be.true;
            expect(storageMock.setItem.firstCall.args[0]).to.equal(key);
            expect(storageMock.setItem.firstCall.args[1]).to.equal("{}");
        });
    });
});
