import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { ServiceProviderInterface } from "@notes/api/serviceproviders/index";
import { fetchConstructor } from "@notes/api";

/**
 * Provides additional container bindings to the application.
 */
class ContainerBindingsProvider implements ServiceProviderInterface {
    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Create a new configuration provider instance.
     *
     * @param configuration Application configuration.
     */
    public constructor(configuration: ConfigurationInterface) {
        this.configuration = configuration;
    }

    /** @inheritDoc */
    public async register(container: ContainerInterface): Promise<void> {
        const moduleDefinitions = Object.entries(this.configuration.get("containerBindings", {})) as [string, any][];

        for (const [ identifier, moduleDefinition ] of moduleDefinitions) {
            const moduleConstructor = await fetchConstructor(moduleDefinition);

            if (!moduleConstructor) {
                const missingModule = typeof moduleDefinition === "string" ?
                    moduleDefinition :
                    `${moduleDefinition.specifier}::${moduleDefinition.exportName}`;

                throw new Error(`Could not find module: ${missingModule}`);
            }

            container.bindConstructor(identifier, moduleConstructor, moduleDefinition.singleton ?? false);
        }
    }

    /** @inheritDoc */
    public async load(): Promise<void> {}
}

export default ContainerBindingsProvider;
