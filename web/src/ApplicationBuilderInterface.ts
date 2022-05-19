import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { Constructor, StartupInterface } from "@notes/web";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { ReactElement } from "react";

/**
 * Has the ability to build application instances.
 */
interface ApplicationBuilderInterface {
    /**
     * Builds a configured application component.
     *
     * @return Promise resolving with an application React element.
     */
    build(): Promise<ReactElement>;

    /**
     * Configure builder to use the given configuration.
     *
     * @param configuration Application configuration.
     * @return Same instance for method chaining.
     */
    useConfiguration(configuration: ConfigurationInterface): ApplicationBuilderInterface;

    /**
     * Configure builder to use the given logger.
     *
     * @param logger Application logger.
     * @return Same instance for method chaining.
     */
    useLogger(logger: LoggerInterface): ApplicationBuilderInterface;

    /**
     * Configure builder to use the given startup class.
     *
     * @param startupClass Designated startup class.
     * @return Same instance for method chaining.
     */
    useStartupClass(startupClass: Constructor<StartupInterface>): ApplicationBuilderInterface;
}

export default ApplicationBuilderInterface;
