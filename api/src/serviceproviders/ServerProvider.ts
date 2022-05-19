import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { ServerBuilderInterface } from "@moonwalkingbits/apollo/server";
import { ServiceProviderInterface } from "@notes/api/serviceproviders";
import { createServer } from "http";

/**
 * Provides an HTTP server to the application.
 */
class ServerProvider implements ServiceProviderInterface {
    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(serverBuilder: ServerBuilderInterface): Promise<void> {
        serverBuilder.useServerFactory(createServer);
    }
}

export default ServerProvider;
