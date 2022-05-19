import { Application } from "@notes/web/components";
import { ApplicationBuilderInterface, ApplicationContext, Constructor, StartupInterface } from "@notes/web";
import { ConfigurationBuilder, ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { Container } from "@moonwalkingbits/apollo/container";
import { LoggerBuilder, LoggerInterface } from "@moonwalkingbits/apollo/log";
import { PropsInterface } from "@notes/web/components/application";
import { ReactElement, createElement } from "react";

/**
 * Has the ability to build application instances.
 */
class ApplicationBuilder implements ApplicationBuilderInterface {
    /**
     * Application configuration.
     */
    private configuration?: ConfigurationInterface;

    /**
     * Application logger.
     */
    private logger?: LoggerInterface;

    /**
     * Designated startup class.
     */
    private startupClass?: Constructor<StartupInterface>;

    /** @inheritDoc */
    public async build(): Promise<ReactElement> {
        const container = new Container();

        container.bindInstance("applicationBuilder", this);
        container.bindInstance("applicationContext", ApplicationContext);
        container.bindInstance("container", container);
        container.bindInstance("configuration", await this.createConfiguration());
        container.bindInstance("logger", this.createLogger());

        if (this.startupClass) {
            await container.construct(this.startupClass).configure(container);
        }

        return createElement(Application, {context: ApplicationContext, container} as PropsInterface);
    }

    /** @inheritDoc */
    public useConfiguration(configuration: ConfigurationInterface): this {
        this.configuration = configuration;

        return this;
    }

    /** @inheritDoc */
    public useLogger(logger: LoggerInterface): this {
        this.logger = logger;

        return this;
    }

    /** @inheritDoc */
    public useStartupClass(startupClass: Constructor<StartupInterface>): this {
        this.startupClass = startupClass;

        return this;
    }

    /**
     * Create application configuration.
     *
     * @return Promise resolving with a configuration instance.
     */
    private async createConfiguration(): Promise<ConfigurationInterface> {
        return this.configuration ?? await new ConfigurationBuilder().build();
    }

    /**
     * Create application logger.
     *
     * @return Promise resolving with a logger instance.
     */
    private createLogger(): LoggerInterface {
        return this.logger ?? new LoggerBuilder().build();
    }
}

export default ApplicationBuilder;
