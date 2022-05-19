import { Event } from "@notes/model/event";

/**
 * Represents an event listener function.
 */
interface ListenerFunctionInterface<T = unknown> {
    /**
     * Handle the dispatched event.
     *
     * @param event Dispatched event.
     * @param identifier Event identifier.
     * @return Optional promise resolving when the listener is done.
     */
    (event: Event<T>, identifier: string): void | Promise<void>;
}

export default ListenerFunctionInterface;
