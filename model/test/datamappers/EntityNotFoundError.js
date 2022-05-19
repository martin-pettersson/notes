import { EntityNotFoundError } from "@notes/model/datamappers";
import { expect } from "chai";

describe("EntityNotFoundError", () => {
    describe("#constructor", () => {
        it("should accept entity id", () => {
            expect(new EntityNotFoundError("id").id).to.equal("id");
        });

        it("should provide default message", () => {
            expect(new EntityNotFoundError("id").message.length).to.be.greaterThan(0);
        });
    });
});
