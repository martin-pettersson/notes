import { ApplicationContextInterface } from "@notes/web";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { Context } from "react";

/**
 * Represents the application component's properties.
 */
interface PropsInterface {
    /**
     * Context to render the application in.
     */
    context: Context<ApplicationContextInterface>;

    /**
     * Dependency injection container.
     */
    container: ContainerInterface;
}

export default PropsInterface;
