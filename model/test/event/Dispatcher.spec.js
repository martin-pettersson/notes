import { Dispatcher, Event } from "@notes/model/event";
import { expect } from "chai";

describe("Dispatcher", () => {
    let dispatcher;

    beforeEach(() => {
        dispatcher = new Dispatcher();
    });

    describe("#addListener", () => {
        it("should accept function listener", () => {
            let called = false;

            dispatcher.addListener("test", () => called = true);

            dispatcher.dispatch("test", new Event());

            expect(called).to.be.true;
        });

        it("should accept class listener", () => {
            class TestListener {
                called = false;

                handle() {
                    this.called = true;
                }
            }

            const listener = new TestListener();

            dispatcher.addListener("test", listener);

            dispatcher.dispatch("test", new Event());

            expect(listener.called).to.be.true;
        });

        it("should filter out duplicate listeners", () => {
            class TestListener {
                timesCalled = 0;

                handle() {
                    this.timesCalled++;
                }
            }
            const listener = new TestListener();

            dispatcher.addListener("test", listener);
            dispatcher.addListener("test", listener);
            dispatcher.addListener("test", listener);

            dispatcher.dispatch("test", new Event());

            expect(listener.timesCalled).to.equal(1);
        });

        it("should filter out duplicate function listeners", () => {
            let timesCalled = 0;
            const listener = () => timesCalled++;

            dispatcher.addListener("test", listener);
            dispatcher.addListener("test", listener);
            dispatcher.addListener("test", listener);

            dispatcher.dispatch("test", new Event());

            expect(timesCalled).to.equal(1);
        });
    });

    describe("#dispatch", () => {
        it("should dispatch given event", async () => {
            const event = new Event();
            let called = false;

            dispatcher.addListener("test", e => {
                called = true;

                expect(e).to.eql(event);
            });

            await dispatcher.dispatch("test", event);

            expect(called).to.be.true;
        });

        it("should not throw if no listeners", async () => {
            await dispatcher.dispatch("test", new Event());
        });

        it("should stop dispatching when event propagation is stopped", async () => {
            const event = new Event();
            let timesCalled = 0;

            dispatcher.addListener("test", event => {
                timesCalled++;

                event.stopPropagation();
            });
            dispatcher.addListener("test", () => timesCalled++);
            dispatcher.addListener("test", () => timesCalled++);

            await dispatcher.dispatch("test", event);
            await dispatcher.dispatch("test", event);

            expect(timesCalled).to.equal(1);
        });

        it("should invoke listeners in sequence", async () => {
            let timesCalled = 0;

            dispatcher.addListener("test", () => new Promise(resolve => {
                setTimeout(() => {
                    expect(timesCalled++).to.equal(0);

                    resolve();
                });
            }));
            dispatcher.addListener("test", () => expect(timesCalled++).to.equal(1));
            dispatcher.addListener("test", () => new Promise(resolve => {
                setTimeout(() => {
                    expect(timesCalled++).to.equal(2);

                    resolve();
                });
            }));
            dispatcher.addListener("test", () => expect(timesCalled++).to.equal(3));

            await dispatcher.dispatch("test", new Event());

            expect(timesCalled).to.equal(4);
        });
    });
});
