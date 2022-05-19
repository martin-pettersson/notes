import { NoteCriteria } from "@notes/model/repositories";
import { expect } from "chai";

describe("NoteCriteria", () => {
    let criteria;

    beforeEach(() => {
        criteria = new NoteCriteria();
    });

    describe("#fromParameters", () => {
        it("should create criteria instance from parameters", async () => {
            expect(NoteCriteria.fromParameters({})).to.be.instanceof(NoteCriteria);
        });

        it("should set search phrase criteria", () => {
            expect(NoteCriteria.fromParameters({q: "phrase"}).searchPhrase).to.equal("phrase");
        });

        it("should set page criteria", () => {
            expect(NoteCriteria.fromParameters({page: 1}).offset).to.equal(0);
        });

        it("should set page size criteria", () => {
            expect(NoteCriteria.fromParameters({page_size: 2}).limit).to.equal(2);
        });
    });

    describe("#isSatisfiedBy", () => {
        it("should be satisfied by all notes", () => {
            expect(criteria.isSatisfiedBy({})).to.be.true;
        });

        it("should be satisfied by notes with matching title", () => {
            criteria.matchingSearchPhrase("title");

            expect(criteria.isSatisfiedBy({title: "title", content: ""})).to.be.true;
            expect(criteria.isSatisfiedBy({title: "this is a title", content: ""})).to.be.true;
            expect(criteria.isSatisfiedBy({title: "the title is here", content: ""})).to.be.true;

            expect(criteria.isSatisfiedBy({title: "there is no titl...aaaaah", content: ""})).to.be.false;
            expect(criteria.isSatisfiedBy({title: "", content: ""})).to.be.false;
        });

        it("should be satisfied by notes with matching content", () => {
            criteria.matchingSearchPhrase("content");

            expect(criteria.isSatisfiedBy({content: "content", title: ""})).to.be.true;
            expect(criteria.isSatisfiedBy({content: "this is the content", title: ""})).to.be.true;
            expect(criteria.isSatisfiedBy({content: "the content is here", title: ""})).to.be.true;

            expect(criteria.isSatisfiedBy({content: "there is no conten...aaaaah", title: ""})).to.be.false;
            expect(criteria.isSatisfiedBy({content: "", title: ""})).to.be.false;
        });

        it("should be satisfied by notes with either matching title or content", () => {
            criteria.matchingSearchPhrase("phrase");

            expect(criteria.isSatisfiedBy({title: "title including phrase", content: ""})).to.be.true;
            expect(criteria.isSatisfiedBy({title: "", content: "content including phrase"})).to.be.true;
            expect(criteria.isSatisfiedBy({title: "title including phrase", content: "content including phrase"})).to.be.true;
        });
    });
});
