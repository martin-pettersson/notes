import { AbstractEntity } from "@notes/model/entities";
import { expect } from "chai";

describe("AbstractEntity", () => {
    const id = "id";
    let entity;

    beforeEach(() => {
        entity = new AbstractEntity(id);
    });

    describe("#constructor", () => {
        it("should accept constructor parameters", () => {
            expect(entity.id).to.equal(id);
        });
    });

    describe("toJSON", () => {
        it("should produce a JSON representation", () => {
            expect(JSON.stringify(entity)).to.equal('{"id":"id"}');
        });
    });
});
