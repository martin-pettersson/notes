import { Note } from "@notes/model/entities";
import { expect } from "chai";

describe("Note", () => {
    const id = "id";
    const title = "Title";
    const content = "Content";
    const created = new Date(Date.UTC(2020));
    const lastUpdated = new Date(Date.UTC(2020, 1));
    let note;

    beforeEach(() => {
        note = new Note(id, title, content, created, lastUpdated);
    });

    describe("#constructor", () => {
        it("should accept constructor parameters", () => {
            expect(note.id).to.equal(id);
            expect(note.title).to.equal(title);
            expect(note.content).to.equal(content);
        });
    });

    describe("#withTitle", () => {
        it("should produce note with given title", () => {
            const title = "New Title";

            expect(note.withTitle(title).title).to.equal(title);
        });

        it("should not mutate instance", () => {
            const newNote = note.withTitle("New Title");

            expect(newNote).to.not.equal(note);
            expect(note.title).to.equal(title);
        });

        it("should produce same instance for same title", () => {
            expect(note.withTitle(title)).to.equal(note);
        });
    });

    describe("#withContent", () => {
        it("should produce note with given content", () => {
            const content = "New content";

            expect(note.withContent(content).content).to.equal(content);
        });

        it("should not mutate instance", () => {
            const newNote = note.withContent("New content");

            expect(newNote).to.not.equal(note);
            expect(note.content).to.equal(content);
        });

        it("should produce same instance for same content", () => {
            expect(note.withContent(content)).to.equal(note);
        });
    });

    describe("#lastCreatedAt", () => {
        it("should produce note instance last updated at a given moment", () => {
            const moment = new Date("2021-01-01");

            expect(note.lastUpdatedAt(moment).lastUpdated).to.equal(moment);
        });

        it("should not mutate instance", () => {
            const newNote = note.lastUpdatedAt(new Date("2021-01-01"));

            expect(newNote).to.not.equal(note);
            expect(note.lastUpdated).to.equal(lastUpdated);
        });

        it("should produce same instance for same moment", () => {
            expect(note.lastUpdatedAt(lastUpdated)).to.equal(note);
        });
    });

    describe("toJSON", () => {
        it("should produce a JSON representation", () => {
            expect(JSON.stringify(note)).to.equal(JSON.stringify({
                id: "id",
                title: "Title",
                content: "Content",
                created: "2020-01-01T00:00:00.000Z",
                lastUpdated: "2020-02-01T00:00:00.000Z"
            }));
        });
    });
});
