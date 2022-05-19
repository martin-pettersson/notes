import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { StartupInterface } from "@moonwalkingbits/apollo/server";
import { fetchConstructor } from "@notes/api";

/**
 * A minimal startup routine.
 */
class Startup implements StartupInterface {
    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Create a new startup instance.
     *
     * @param configuration Application configuration.
     */
    public constructor(configuration: ConfigurationInterface) {
        this.configuration = configuration;
    }

    /** @inheritDoc */
    public async configure(container: ContainerInterface): Promise<void> {
        const serviceProviderConstructors = await Promise.all(
            this.configuration.get("serviceProviders", []).map(fetchConstructor)
        );
        const serviceProviderInstances = [];

        // Registering all service providers before loading them allows us to
        // register/share services through the container, so they can be used
        // when the service providers are loaded later on.
        for (const constructor of serviceProviderConstructors) {
            const serviceProvider = container.construct(constructor);

            await serviceProvider.register(container);
            serviceProviderInstances.push(serviceProvider);
        }

        for (const provider of serviceProviderInstances) {
            await container.invoke(provider.load.bind(provider), {}, provider.load);
        }
    }
}

export default Startup;
