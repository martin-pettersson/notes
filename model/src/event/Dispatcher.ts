import { DispatcherInterface, Event, ListenerFunctionInterface, ListenerInterface } from "@notes/model/event";

/**
 * Event dispatcher responsible for dispatching events to their respective listeners.
 */
class Dispatcher implements DispatcherInterface {
    /**
     * Map of event identifiers and their respective listeners.
     */
    private listeners: Map<string, Set<ListenerInterface<any> | ListenerFunctionInterface<any>>> = new Map();

    /**
     * Dispatch the given event to the registered event listeners.
     *
     * @param identifier Event identifier.
     * @param event Event to dispatch.
     * @return Promise resolving when all listeners have been notified.
     */
    public async dispatch<T = unknown>(identifier: string, event: Event<T>): Promise<void> {
        if (!this.listeners.has(identifier)) {
            return;
        }

        for (const listener of this.listeners.get(identifier)!) {
            if (!event.shouldPropagate) {
                break;
            }

            await this.invokeListener(listener, event, identifier);
        }
    }

    /**
     * Add event listener for the given identifier.
     *
     * We intentionally keep the listener as a union to let the set filter out
     * any duplicates. The actual type will be resolved when the listener is
     * being invoked.
     *
     * @param identifier Event identifier.
     * @param listener Listener to be invoked when the event is dispatched.
     */
    public addListener<T = unknown>(
        identifier: string,
        listener: ListenerInterface<T> | ListenerFunctionInterface<T>
    ): void {
        const listeners = this.listeners.get(identifier) ?? new Set();

        listeners.add(listener);

        this.listeners.set(identifier, listeners);
    }

    /**
     * Invoke the given listener with the dispatched event.
     *
     * @param listener Listener to invoke.
     * @param event Dispatched event.
     * @param identifier Event identifier.
     * @return Optional promise resolving when the listener is done.
     */
    private invokeListener<T = unknown>(
        listener: ListenerInterface | ListenerFunctionInterface,
        event: Event<T>,
        identifier: string
    ): void | Promise<void> {
        if (this.isFunctionListener(listener)) {
            return listener.apply(listener, [event, identifier]);
        }

        return listener.handle(event, identifier);
    }

    /**
     * Determine if the given listener is a function listener.
     *
     * @param listener Arbitrary listener.
     * @return True if the given listener is a function listener.
     */
    private isFunctionListener(
        listener: ListenerInterface | ListenerFunctionInterface
    ): listener is ListenerFunctionInterface {
        return typeof listener === "function";
    }
}

export default Dispatcher;
