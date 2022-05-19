import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { RequestHandler } from "@moonwalkingbits/apollo/server";
import { ServiceProviderInterface } from "@notes/api/serviceproviders";
import { fetchConstructor } from "@notes/api";

/**
 * Provides middleware to the application request handler.
 */
class MiddlewareProvider implements ServiceProviderInterface {
    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Create a new middleware service provider instance.
     *
     * @param configuration Application configuration.
     */
    public constructor(configuration: ConfigurationInterface) {
        this.configuration = configuration;
    }

    /** @inheritDoc */
    public async register(_: ContainerInterface): Promise<void> {}

    /** @inheritDoc */
    public async load(container: ContainerInterface, requestHandler: RequestHandler): Promise<void> {
        const middleware = await Promise.all(this.configuration.get("middleware", []).map(fetchConstructor));

        middleware.forEach(constructor => requestHandler.addMiddleware(container.construct(constructor)));
    }
}

export default MiddlewareProvider;
