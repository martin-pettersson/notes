import { MiddlewareInterface, RequestHandlerInterface } from "@moonwalkingbits/apollo/server";
import { RequestInterface, ResponseInterface, } from "@moonwalkingbits/apollo/http";

/**
 * Provides an application version header on all response messages.
 */
class VersionMiddleware implements MiddlewareInterface {
    /** @inheritDoc */
    public async process(
        request: RequestInterface,
        requestHandler: RequestHandlerInterface
    ): Promise<ResponseInterface> {
        const response = await requestHandler.handle(request);

        return response.withHeader("Version", process.env.APP_VERSION ?? "unknown");
    }
}

export default VersionMiddleware;
