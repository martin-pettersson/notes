import chai from "chai";
import chaiAsPromised from "chai-as-promised"
import { DataMapper } from "@notes/data-memory/datamappers";
import { DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";

chai.use(chaiAsPromised);

const { expect } = chai;

describe("DataMapper", () => {
    let entity;
    let dataMapper;

    beforeEach(() => {
        entity = {id: "id"};
        dataMapper = new DataMapper(new Map([[entity.id, entity]]));
    });

    describe("#constructor", () => {
        it("should be empty by default", async () => {
            expect(await new DataMapper().get(entity.id)).to.be.null;
        });
    });

    describe("#get", () => {
        it("should return entity by id", async () => {
            expect(await dataMapper.get(entity.id)).to.equal(entity);
        });

        it("should return null if not found", async () => {
            expect(await dataMapper.get("non-existent")).to.be.null;
        });
    });

    describe("#insert", () => {
        it("should insert entity into storage", async () => {
            const dataMapper = new DataMapper();

            await dataMapper.insert(entity);

            expect(await dataMapper.get(entity.id)).to.equal(entity);
        });

        it("should throw if duplicate id", async () => {
            await expect(dataMapper.insert(entity)).to.eventually.be.rejectedWith(DuplicateEntityError);
        });
    });

    describe("#update", () => {
        it("should update entity in storage", async () => {
            const updatedEntity = {...entity};

            await dataMapper.update(updatedEntity);

            expect(await dataMapper.get(updatedEntity.id)).to.equal(updatedEntity);
        });

        it("should throw if not found", async () => {
            await expect(dataMapper.update({id: "non-existent"})).to.eventually.be.rejectedWith(EntityNotFoundError);
        });
    });

    describe("#delete", () => {
        it("should remove entity from storage", async () => {
            await dataMapper.delete(entity);

            expect(await dataMapper.get(entity.id)).to.be.null;
        });

        it("should not throw if not found", async () => {
            await dataMapper.delete({id: "non-existent"});
        });
    });
});
