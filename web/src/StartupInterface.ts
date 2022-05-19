import { ContainerInterface } from "@moonwalkingbits/apollo/container";

/**
 * Has the ability to configure applications at startup.
 */
interface StartupInterface {
    /**
     * Configure the given container instance.
     *
     * @param container Application container.
     * @return Promise resolving when the operation is done.
     */
    configure(container: ContainerInterface): Promise<void>;
}

export default StartupInterface;
