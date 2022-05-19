import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { Constructor, StartupInterface } from "@notes/web";
import {
    ContainerBindingsProvider,
    DataLayerProvider,
    EventProvider,
    FontProvider,
    ServiceProviderInterface,
    ValidationProvider
} from "@notes/web/serviceproviders";

/**
 * A minimal startup routine.
 */
class Startup implements StartupInterface {
    /**
     * Service providers to register.
     */
    private static serviceProviders = [
        ContainerBindingsProvider,
        EventProvider,
        DataLayerProvider,
        ValidationProvider,
        FontProvider
    ] as Array<Constructor<ServiceProviderInterface>>;

    /** @inheritDoc */
    public async configure(container: ContainerInterface): Promise<void> {
        const serviceProviders = Startup.serviceProviders.map(constructor => container.construct(constructor));

        for (const serviceProvider of serviceProviders) {
            await serviceProvider.register(container);
        }

        for (const serviceProvider of serviceProviders) {
            await container.invoke(serviceProvider.load.bind(serviceProvider), {}, serviceProvider.load);
        }
    }
}

export default Startup;
