import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { MiddlewareInterface, RequestHandlerInterface } from "@moonwalkingbits/apollo/server";
import { RequestInterface, ResponseInterface, } from "@moonwalkingbits/apollo/http";

/**
 * Provides logging for incoming request messages.
 */
class LogMiddleware implements MiddlewareInterface {
    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new log middleware instance.
     *
     * @param logger Application logger.
     */
    public constructor(logger: LoggerInterface) {
        this.logger = logger;
    }

    /** @inheritDoc */
    public async process(
        request: RequestInterface,
        requestHandler: RequestHandlerInterface
    ): Promise<ResponseInterface> {
        const response = await requestHandler.handle(request);

        this.logger.debug(`${request.method} /${request.url.path} → ${response.statusCode}`, {request});

        return response;
    }
}

export default LogMiddleware;
