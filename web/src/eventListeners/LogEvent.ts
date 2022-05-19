import { Event, ListenerInterface } from "@notes/model/event";
import { LoggerInterface } from "@moonwalkingbits/apollo/log";

/**
 * Logs events using the application logger.
 */
class LogEvent implements ListenerInterface<unknown> {
    /**
     * Application logger.
     */
    private readonly logger: LoggerInterface;

    /**
     * Create a new log event listener instance.
     *
     * @param logger Application logger.
     */
    public constructor(logger: LoggerInterface) {
        this.logger = logger;
    }

    /** @inheritDoc */
    public handle(event: Event<unknown>, identifier: string): void {
        this.logger.debug(`${identifier}: ${JSON.stringify(event.payload)}`);
    }
}

export default LogEvent;
