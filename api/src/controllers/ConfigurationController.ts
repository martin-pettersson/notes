import { AbstractController } from "@moonwalkingbits/apollo";
import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { GET, route } from "@moonwalkingbits/apollo/routing";
import { ResponseInterface } from "@moonwalkingbits/apollo/http";

/**
 * Controller handling resources for the application configuration.
 */
@route("v1/configuration")
class ConfigurationController extends AbstractController {
    /**
     * Provide the application configuration.
     *
     * @param configuration Application configuration.
     * @return Promise resolving with an HTTP response message representing the application configuration.
     */
    @GET()
    public async list(configuration: ConfigurationInterface): Promise<ResponseInterface> {
        return this.json(configuration.all());
    }
}

export default ConfigurationController;
