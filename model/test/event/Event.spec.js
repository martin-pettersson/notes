import { Event } from "@notes/model/event";
import { expect } from "chai";

describe("Event", () => {
    let payload;
    let event;

    beforeEach(() => {
        payload = "payload";
        event = new Event(payload);
    });

    describe("#constructor", () => {
        it("should initialize all properties", () => {
            expect(event.payload).to.eql(payload);
            expect(event.shouldPropagate).to.be.true;
        });
    });

    describe("#stopPropagation", () => {
        it("should stop the event from propagating", () => {
            event.stopPropagation();

            expect(event.shouldPropagate).to.be.false;
        });
    });
});
