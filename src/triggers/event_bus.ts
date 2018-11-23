export interface ISubscription {
    context?: any;
    callback: (...args: any[]) => void;
}

export class EventBus {

    /**
     * Holds the subscriptions to apply for each channel.
     */
    private channels: { [channel: string]: ISubscription[] } = {};

    /**
     * Runs all the callbacks for the subscriptions associated with the given
     * channel passing any additional arguments to the callbacks themselves.
     */
    public publish(channel: string, ...args: any[]): void {
        if (this.channels[channel]) { // Is anyone listening?
            for (const subscription of this.channels[channel]) {
                subscription.callback.apply(subscription.context, args);
            }
        }
    }

    /**
     * adds a subscription for the given channel. The callback in the
     * subscription is run when a process publishes to the given channel.
     */
    public subscribe(channel: string, subscription: ISubscription): () => void {
        this.channels[channel] = this.channels[channel] || [];
        this.channels[channel].push(subscription);
        const index = this.channels[channel].length - 1;
        return () => { this.channels[channel].splice(index, 1); };
    }
}
