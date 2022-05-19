import { DataMapperInterface, DuplicateEntityError, EntityNotFoundError } from "@notes/model/datamappers";
import { Db, MongoServerError, ObjectId } from "mongodb";
import { Note } from "@notes/model/entities";

/**
 * A MongoDB implementation of a note entity data mapper.
 */
class NoteDataMapper implements DataMapperInterface<Note>{
    /**
     * Map between entity and database properties.
     *
     * This is used to connect property issues between database and entity.
     */
    private static propertyMap: {[key: string]: string} = {
        _id: "id"
    };

    /**
     * Database connection instance.
     */
    private readonly connection: Db;

    /**
     * Create a new note entity data mapper instance.
     *
     * @param connection Database connection instance.
     */
    public constructor(connection: Db) {
        this.connection = connection;
    }

    /** @inheritDoc */
    public async get(id: string): Promise<Note | null> {
        const document = await this.connection.collection("notes").findOne({_id: id});

        if (!document) {
            return null;
        }

        return new Note(
            document._id.toString(),
            document.title,
            document.content,
            document.created,
            document.lastUpdated
        );
    }

    /** @inheritDoc */
    public async insert(note: Note): Promise<void> {
        try {
            await this.connection.collection("notes").insertOne({
                _id: note.id as any as ObjectId,
                title: note.title,
                content: note.content,
                created: note.created,
                lastUpdated: note.lastUpdated
            });
        } catch (error) {
            if (error.code === 11000) {
                const [ property ] = Object.keys((error as MongoServerError).keyPattern);

                throw new DuplicateEntityError(NoteDataMapper.propertyMap[property as string]!);
            }

            throw error;
        }
    }

    /** @inheritDoc */
    public async update(note: Note): Promise<void> {
        try {
            const result = await this.connection.collection("notes").updateOne(
                {
                    _id: note.id
                },
                {
                    $set: {
                        title: note.title,
                        content: note.content,
                        created: note.created,
                        lastUpdated: note.lastUpdated
                    }
                }
            );

            if (result.matchedCount === 0) {
                throw new EntityNotFoundError(note.id);
            }
        } catch (error) {
            if (error.code === 11000) {
                const [ property ] = Object.keys((error as MongoServerError).keyPattern);

                throw new DuplicateEntityError(NoteDataMapper.propertyMap[property as string]!);
            }

            throw error;
        }
    }

    /** @inheritDoc */
    public async delete(note: Note): Promise<void> {
        await this.connection.collection("notes").deleteOne({_id: note.id});
    }
}

export default NoteDataMapper;
