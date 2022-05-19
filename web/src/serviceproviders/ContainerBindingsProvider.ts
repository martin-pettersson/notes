import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { CreateNote, DeleteNote, ListNotes, PatchNote } from "@notes/model/services";
import { ServiceProviderInterface } from "@notes/web/serviceproviders";

/**
 * Provides additional container bindings to the application.
 */
class ContainerBindingsProvider implements ServiceProviderInterface {
    /** @inheritDoc */
    public async register(container: ContainerInterface): Promise<void> {
        container.bindConstructor("listNotes", ListNotes);
        container.bindConstructor("createNote", CreateNote);
        container.bindConstructor("patchNote", PatchNote);
        container.bindConstructor("deleteNote", DeleteNote);
    }

    /** @inheritDoc */
    public async load(): Promise<void> {}
}

export default ContainerBindingsProvider;
