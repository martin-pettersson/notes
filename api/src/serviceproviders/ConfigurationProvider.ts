import {
    ConfigurationBuilder,
    ConfigurationInterface,
    JsonConfigurationSource,
    MergeStrategy
} from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { ServiceProviderInterface } from "@notes/api/serviceproviders/index";

/**
 * Provides additional configuration to the application.
 */
class ConfigurationProvider implements ServiceProviderInterface {
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
        try {
            container.bindInstance(
                "configuration",
                this.configuration
                    .merge(await this.configurationFrom(this.configuration.get("configurationSources", {})))
                    .merge(await this.configurationFor(process.env.NODE_ENV!), void 0, MergeStrategy.REPLACE_INDEXED)
            );
        } catch (error) {
            throw new Error(`Failed to build application configuration: ${error.message}`);
        }
    }

    /** @inheritDoc */
    public async load(): Promise<void> {}

    /**
     * Compile a single configuration object from the given configuration sources.
     *
     * @param configurationSources Arbitrary set of configuration sources and corresponding key paths.
     * @return Promise resolving with a configuration instance.
     */
    private async configurationFrom(
        configurationSources: {[key: string]: string}
    ): Promise<ConfigurationInterface> {
        const configurationBuilder = new ConfigurationBuilder();

        Object.entries(configurationSources).forEach(([ keyPath, source]) => {
            configurationBuilder.addConfigurationSource(new JsonConfigurationSource(source), keyPath);
        });

        try {
            return await configurationBuilder.build();
        } catch (error) {
            if (error.code === "ENOENT") {
                throw new Error(`Could not find configuration source: ${error.path}`);
            }

            throw error;
        }
    }

    /**
     * Fetch configuration for the given environment.
     *
     * @param environment Arbitrary environment identifier.
     * @return Promise resolving with an environment specific configuration instance.
     */
    private async configurationFor(environment: string): Promise<ConfigurationInterface> {
        try {
            return await new ConfigurationBuilder()
                .addConfigurationSource(new JsonConfigurationSource(`configuration.${environment}.json`))
                .build();
        } catch (error) {
            if (error.code === "ENOENT") {
                return new ConfigurationBuilder().build();
            }

            throw error;
        }
    }
}

export default ConfigurationProvider;
