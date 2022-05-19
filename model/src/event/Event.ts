/**
 * Generic event object extended by all dispatched events.
 */
class Event<T = unknown> {
    /**
     * Arbitrary event payload.
     */
    public readonly payload: T;

    /**
     * Whether the event should continue to propagate.
     */
    private _shouldPropagate: boolean;

    /**
     * Whether the event should continue to propagate.
     */
    public get shouldPropagate(): boolean {
        return this._shouldPropagate;
    }

    /**
     * Create a new event instance.
     *
     * @param payload Arbitrary payload.
     * @param shouldPropagate Whether the event should continue to propagate.
     */
    public constructor(payload: T, shouldPropagate: boolean = true) {
        this.payload = payload;
        this._shouldPropagate = shouldPropagate;
    }

    /**
     * Prevent the event from propagating further.
     */
    public stopPropagation(): void {
        this._shouldPropagate = false;
    }
}

export default Event;
