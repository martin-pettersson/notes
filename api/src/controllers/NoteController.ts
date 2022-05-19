import { AbstractController } from "@moonwalkingbits/apollo";
import { CreateNote, DeleteNote, GetNote, ListNotes, PatchNote, UpdateNote } from "@notes/model/services";
import { DELETE, GET, PATCH, POST, PUT, route } from "@moonwalkingbits/apollo/routing";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { Readable } from "stream";
import {
    RequestInterface,
    ResponseFactoryInterface,
    ResponseInterface,
    ResponseStatus,
    StreamFactoryInterface
} from "@moonwalkingbits/apollo/http";
import { ValidatorError } from "@moonwalkingbits/apollo/validation";
import { readStream } from "@notes/api";

/**
 * Controller handling resources for the note entity.
 */
@route("v1/notes")
class NoteController extends AbstractController {
    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new note controller instance.
     *
     * @param responseFactory HTTP response factory.
     * @param streamFactory Stream factory.
     * @param logger Application logger.
     */
    public constructor(
        responseFactory: ResponseFactoryInterface,
        streamFactory: StreamFactoryInterface,
        logger: LoggerInterface
    ) {
        super(responseFactory, streamFactory);

        this.logger = logger;
    }

    /**
     * List notes matching given request parameters.
     *
     * @param request Incoming HTTP request message.
     * @param listNotes Note listing service.
     * @return Promise resolving with an HTTP response message representing a set of matching notes.
     */
    @GET()
    public async list(request: RequestInterface, listNotes: ListNotes): Promise<ResponseInterface> {
        try {
            const parameters = Object.fromEntries(new URLSearchParams(request.url.query).entries() as any);

            return this.json(Array.from(await listNotes.matching(parameters)));
        } catch (error) {
            this.logger.error(error.message, {error, request});

            return this.error("An error occurred while retrieving notes", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Create a new note entity instance using the given request.
     *
     * @param request Incoming HTTP request message.
     * @param createNote Note creation service.
     * @return Promise resolving with an HTTP message representing the created resource.
     */
    @POST()
    public async create(request: RequestInterface, createNote: CreateNote): Promise<ResponseInterface> {
        if (!request.headerLine("Content-Type").includes("application/json")) {
            return this.error("Unsupported content type", ResponseStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        let noteRepresentation: any;

        try {
            noteRepresentation = JSON.parse(await readStream(request.body as Readable));
        } catch (error) {
            return this.error(error.message, ResponseStatus.BAD_REQUEST);
        }

        try {
            const note = await createNote.fromObject(noteRepresentation);

            return this.created(`/v1/notes/${note.id}`);
        } catch (error) {
            if (error instanceof ValidatorError) {
                return this.json(error.errors, ResponseStatus.UNPROCESSABLE_ENTITY);
            }

            this.logger.error(error.message, {error, request});

            return this.error("An error occurred while creating the note", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieve note entity by id.
     *
     * @param id Unique identifier.
     * @param getNote Note retrieval service.
     * @return Promise resolving with a response message representing a note entity.
     */
    @GET(":id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})")
    public async get(id: string, getNote: GetNote): Promise<ResponseInterface> {
        try {
            const note = await getNote.byId(id);

            if (!note) {
                return this.notFound();
            }

            return this.json(note);
        } catch (error) {
            this.logger.error(error.message, {error});

            return this.error("An error occurred while retrieving the note", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update note entity using given request.
     *
     * @param id Unique identifier.
     * @param request Incoming HTTP request message.
     * @param getNote Note retrieval service.
     * @param updateNote Note updating service.
     * @return Promise resolving with an HTTP message representing the updated resource.
     */
    @PUT(":id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})")
    public async update(
        id: string,
        request: RequestInterface,
        getNote: GetNote,
        updateNote: UpdateNote
    ): Promise<ResponseInterface> {
        let noteRepresentation: any;

        try {
            const note = await getNote.byId(id);

            if (!note) {
                return this.notFound();
            }

            if (!request.headerLine("Content-Type").includes("application/json")) {
                return this.error("Unsupported content type", ResponseStatus.UNSUPPORTED_MEDIA_TYPE);
            }

            try {
                noteRepresentation = JSON.parse(await readStream(request.body as Readable));
            } catch (error) {
                return this.error(error.message, ResponseStatus.BAD_REQUEST);
            }

            await updateNote.withObject(note, noteRepresentation);

            return this.noContent();
        } catch (error) {
            if (error instanceof ValidatorError) {
                return this.json(error.errors, ResponseStatus.UNPROCESSABLE_ENTITY);
            }

            this.logger.error(error.message, {error, request});

            return this.error("An error occurred while updating the note", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Patch note entity using given request.
     *
     * @param id Unique identifier.
     * @param request Incoming HTTP request message.
     * @param getNote Note retrieval service.
     * @param patchNote Note patching service.
     * @return Promise resolving with an HTTP message representing the patched resource.
     */
    @PATCH(":id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})")
    public async patch(
        id: string,
        request: RequestInterface,
        getNote: GetNote,
        patchNote: PatchNote
    ): Promise<ResponseInterface> {
        let noteRepresentation: any;

        try {
            const note = await getNote.byId(id);

            if (!note) {
                return this.notFound();
            }

            if (!request.headerLine("Content-Type").includes("application/json")) {
                return this.error("Unsupported content type", ResponseStatus.UNSUPPORTED_MEDIA_TYPE);
            }

            try {
                noteRepresentation = JSON.parse(await readStream(request.body as Readable));
            } catch (error) {
                return this.error(error.message, ResponseStatus.BAD_REQUEST);
            }

            return this.json(await patchNote.withObject(note, noteRepresentation));
        } catch (error) {
            if (error instanceof ValidatorError) {
                return this.json(error.errors, ResponseStatus.UNPROCESSABLE_ENTITY);
            }

            this.logger.error(error.message, {error, request});

            return this.error("An error occurred while patching the note", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove note entity by id.
     *
     * @param id Unique identifier.
     * @param getNote Note retrieval service.
     * @param deleteNote Note removal service.
     * @return Promise resolving with an HTTP message representing the removed resource.
     */
    @DELETE(":id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})")
    public async delete(
        id: string,
        getNote: GetNote,
        deleteNote: DeleteNote
    ): Promise<ResponseInterface> {
        try {
            const note = await getNote.byId(id);

            if (!note) {
                return this.notFound();
            }

            await deleteNote.byReference(note);

            return this.noContent();
        } catch (error) {
            this.logger.error(error.message, {error});

            return this.error("An error occurred while deleting the note", ResponseStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

export default NoteController;
