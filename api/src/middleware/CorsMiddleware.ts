import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { MiddlewareInterface, RequestHandlerInterface } from "@moonwalkingbits/apollo/server";
import {
    RequestInterface,
    RequestMethod,
    ResponseFactoryInterface,
    ResponseInterface,
    ResponseStatus
} from "@moonwalkingbits/apollo/http";

/**
 * Provides API CORS headers.
 */
class CorsMiddleware implements MiddlewareInterface {
    /**
     * HTTP response message factory.
     */
    private readonly responseFactory: ResponseFactoryInterface;

    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Creat a new CORS middleware instance.
     *
     * @param responseFactory HTTP response message factory.
     * @param configuration Application configuration.
     */
    public constructor(responseFactory: ResponseFactoryInterface, configuration: ConfigurationInterface) {
        this.responseFactory = responseFactory;
        this.configuration = configuration;
    }

    /** @inheritDoc */
    public async process(
        request: RequestInterface,
        requestHandler: RequestHandlerInterface
    ): Promise<ResponseInterface> {
        if (request.method === RequestMethod.OPTIONS) {
            return this.responseFactory.createResponse(ResponseStatus.NO_CONTENT)
                .withHeader("Access-Control-Allow-Origin", this.allowedOriginFor(request) ?? "")
                .withHeader(
                    "Access-Control-Allow-Methods",
                    this.configuration.get("cors.allowedMethods", []).join(",")
                )
                .withHeader(
                    "Access-Control-Allow-Headers",
                    this.configuration.get("cors.allowedHeaders", []).join(",")
                )
                .withHeader(
                    "Access-Control-Expose-Headers",
                    this.configuration.get("cors.exposedHeaders", []).join(",")
                );
        }

        return (await requestHandler.handle(request))
            .withHeader("Access-Control-Allow-Origin", this.allowedOriginFor(request) ?? "")
            .withHeader("Access-Control-Expose-Headers", this.configuration.get("cors.exposedHeaders", []).join(","));
    }

    /**
     * Determine allowed origin for the given request.
     *
     * Since the Access-Control-Allow-Origin header does not allow for multiple
     * values we need to dynamically generate the value based on the given
     * request origin.
     *
     * @param request Incoming HTTP request message.
     * @return Allowed origin derived from the given request message.
     */
    private allowedOriginFor(request: RequestInterface): string | null {
        const allowedOrigins = this.configuration.get("cors.allowedOrigins", []) as Array<string>;

        for (const origin of allowedOrigins) {
            if (origin === request.headerLine("Origin") || origin === "*") {
                return origin;
            }
        }

        return null;
    }
}

export default CorsMiddleware;
