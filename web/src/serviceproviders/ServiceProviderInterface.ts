import { ContainerInterface } from "@moonwalkingbits/apollo/container";

/**
 * Has the ability to provide a service to the application.
 */
interface ServiceProviderInterface {
    /**
     * Register any services to the application dependency injection container.
     *
     * @param container Application container.
     * @return Promise resolving when the operation is done.
     */
    register(container: ContainerInterface): Promise<void>;

    /**
     * Provide service to the application.
     *
     * @param args Arbitrary dependencies.
     * @return Promise resolving when the operation is done.
     */
    load(...args: Array<any>): Promise<void>;
}

export default ServiceProviderInterface;
