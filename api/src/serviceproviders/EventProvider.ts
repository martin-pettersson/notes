import { ConfigurationInterface } from "@moonwalkingbits/apollo/configuration";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { Dispatcher, DispatcherInterface } from "@notes/event";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { ServiceProviderInterface } from "@notes/api/serviceproviders";
import { fetchConstructor } from "@notes/api";

/**
 * Provides an event system to the application.
 */
class EventProvider implements ServiceProviderInterface {
    /**
     * Application configuration.
     */
    private readonly configuration: ConfigurationInterface;

    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new event provider instance.
     *
     * @param configuration Application configuration.
     * @param logger Application logger.
     */
    public constructor(configuration: ConfigurationInterface, logger: LoggerInterface) {
        this.configuration = configuration;
        this.logger = logger;
    }

    /** @inheritDoc */
    public async register(container: ContainerInterface): Promise<void> {
        this.logger.info("Registering event listeners");

        const dispatcher = new Dispatcher();
        const eventListeners = this.configuration.get("eventListeners", {});

        for (const [ event, listeners ] of Object.entries(eventListeners)) {
            await this.addListenersTo(event, listeners as Array<string>, dispatcher, container);
        }

        container.bindInstance("eventDispatcher", dispatcher);
    }

    /** @inheritDoc */
    public async load(): Promise<void> {}

    /**
     * Register event listeners to the given event.
     *
     * @param event Event identifier.
     * @param listeners Arbitrary list of event listeners.
     * @param dispatcher Application event dispatcher.
     * @param container Application container.
     * @return Promise resolving when the operation is done.
     */
    private async addListenersTo(
        event: string,
        listeners: Array<string>,
        dispatcher: DispatcherInterface,
        container: ContainerInterface
    ): Promise<void> {
        for (const moduleDefinition of listeners) {
            const listenerConstructor = await fetchConstructor(moduleDefinition);

            if (!listenerConstructor) {
                throw new Error(`Could not find event listener: ${moduleDefinition}`);
            }

            dispatcher.addListener(
                event,
                (event, identifier) => container.construct(listenerConstructor).handle(event, identifier)
            );
        }
    }
}

export default EventProvider;
