import { AbstractController } from "@moonwalkingbits/apollo";
import { GET, HEAD } from "@moonwalkingbits/apollo/routing";
import { ResponseInterface } from "@moonwalkingbits/apollo/http";

/**
 * Provides a health resource to verify the health of the application.
 */
class HealthController extends AbstractController {
    /**
     * Provide application health status.
     *
     * @return Promise resolving with an empty response message on success.
     */
    @HEAD("health")
    public async healthy(): Promise<ResponseInterface> {
        return this.noContent();
    }

    /**
     * Provide application health report.
     *
     * @return Promise resolving with a response message representing an application health report.
     */
    @GET("health")
    public async healthReport(): Promise<ResponseInterface> {
        return this.noContent();
    }
}

export default HealthController;
