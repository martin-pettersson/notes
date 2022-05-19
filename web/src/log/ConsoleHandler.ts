import { LogHandlerInterface, LogLevel } from "@moonwalkingbits/apollo/log";

/**
 * A web console implementation of a log handler.
 */
class ConsoleHandler implements LogHandlerInterface {
    /**
     * Log with an arbitrary level.
     *
     * @param level Log level.
     * @param message Message to log.
     * @param context Context to render message in.
     */
    public log(level: LogLevel, message: string, context?: {[key: string]: any}): void {
        console.log(
            `%c[${level}] %c${this.interpolate(message, context ?? {})}`,
            `color:${this.colorFor(level)}`,
            "color:inherit"
        );
    }

    /**
     * Resolve and inject any context parameters into the given message.
     *
     * @param message Message to render.
     * @param context Context to extract parameters from.
     * @return Rendered message with the context parameters injected.
     */
    private interpolate(message: string, context: {[key: string]: any}): string {
        for (let [ key, value ] of Object.entries(context)) {
            message = message.replace(`{${key}}`, value);
        }

        if (context.error) {
            message = `${context.error.constructor.name}: ${message}\n${context.error.stack.replace(/^.*\n([\s\S]*)$/, "$1")}`;
        }

        return message;
    }

    /**
     * Produce a color for the given log level.
     *
     * @param level Arbitrary log level.
     * @return String representing a hexadecimal color value.
     */
    private colorFor(level: LogLevel): string {
        switch (level) {
            case LogLevel.DEBUG:
                return "#6c757d";
            case LogLevel.INFO:
                return "#17a2b8";
            case LogLevel.NOTICE:
                return "#007bff";
            case LogLevel.WARNING:
                return "#ffc107";
            case LogLevel.ERROR:
            case LogLevel.CRITICAL:
            case LogLevel.ALERT:
                return "#dc3545";
            default:
                return "static";
        }
    }
}

export default ConsoleHandler;
