import { Event, ListenerFunctionInterface, ListenerInterface } from "@notes/event";

/**
 * Represents an event dispatcher responsible for dispatching events to their respective listeners.
 */
interface DispatcherInterface {
    /**
     * Dispatch the given event to the registered event listeners.
     *
     * @param identifier Event identifier.
     * @param event Event to dispatch.
     * @return Promise resolving when all listeners have been notified.
     */
    dispatch<T = unknown>(identifier: string, event: Event<T>): Promise<void>;

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
    addListener<T = unknown>(identifier: string, listener: ListenerInterface<T> | ListenerFunctionInterface<T>): void;
}

export default DispatcherInterface;
