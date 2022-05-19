import { expect } from "chai";
import { isPaginated } from "@notes/model/repositories";

describe("isPaginated", () => {
    it("should determine whether criteria is paginated", () => {
        expect(isPaginated({})).to.be.false;
        expect(isPaginated({offset: 0})).to.be.false;
        expect(isPaginated({limit: 0})).to.be.false;

        expect(isPaginated({offset: 0, limit: 0})).to.be.true;
    });
});
