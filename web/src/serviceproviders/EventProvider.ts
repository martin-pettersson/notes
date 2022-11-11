import { Constructor } from "@notes/web";
import { ContainerInterface } from "@moonwalkingbits/apollo/container";
import { Dispatcher, DispatcherInterface, ListenerInterface } from "@notes/event";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";
import { ServiceProviderInterface } from "@notes/web/serviceproviders";

/**
 * Provides an event system to the application.
 */
class EventProvider implements ServiceProviderInterface {
    /**
     * Event listeners to register.
     */
    private static eventListeners = {
        ["note:created"]: [],
        ["note:updated"]: [],
        ["note:deleted"]: []
    };

    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new event provider instance.
     *
     * @param logger Application logger.
     */
    public constructor(logger: LoggerInterface) {
        this.logger = logger;
    }

    /** @inheritDoc */
    public async register(container: ContainerInterface): Promise<void> {
        this.logger.info("Registering event listeners");

        const dispatcher = new Dispatcher();

        for (const [ event, listeners ] of Object.entries(EventProvider.eventListeners)) {
            this.addListenersTo(event, listeners, dispatcher, container);
        }

        container.bindInstance("eventDispatcher", dispatcher);
    }

    /** @inheritDoc */
    public async load(_: ContainerInterface): Promise<void> {}

    /**
     * Register event listeners to the given event.
     *
     * @param event Event identifier.
     * @param listeners Arbitrary list of event listeners.
     * @param dispatcher Application event dispatcher.
     * @param container Application container.
     */
    private addListenersTo(
        event: string,
        listeners: Array<Constructor<ListenerInterface>>,
        dispatcher: DispatcherInterface,
        container: ContainerInterface
    ): void {
        for (const listener of listeners) {
            dispatcher.addListener(
                event,
                (event, identifier) => container.construct(listener).handle(event, identifier)
            );
        }
    }
}

export default EventProvider;
