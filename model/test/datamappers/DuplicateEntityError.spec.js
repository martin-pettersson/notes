import { DuplicateEntityError } from "@notes/model/datamappers";
import { expect } from "chai";

describe("DuplicateEntityError", () => {
    describe("#constructor", () => {
        it("should accept property name", () => {
            expect(new DuplicateEntityError("property").property).to.equal("property");
        });

        it("should provide default message", () => {
            expect(new DuplicateEntityError("property").message.length).to.be.greaterThan(0);
        });
    });
});
