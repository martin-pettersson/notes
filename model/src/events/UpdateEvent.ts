import { Event } from "@notes/event";

/**
 * Update event providing current and previous instances.
 */
class UpdateEvent<T> extends Event<[T, T]> {}

export default UpdateEvent;
