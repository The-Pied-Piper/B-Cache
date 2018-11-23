import { EventBus } from "./event_bus";
import { IInstance, IMutator, ISubscriptionEntry, PropertyDatabase } from "./propertydb";

export class PropertyHandler {
    private propertydb: PropertyDatabase = new PropertyDatabase();
    private eventBus: EventBus = new EventBus();

    /**
     * Returns a PropertyDecorator for for adding a mutator to the decorated
     * property.
     */
    public add_mutator(mutator: IMutator): PropertyDecorator {
        const propertydb = this.propertydb;
        const propertyHandler = this;
        return (prototype: any, name: string | symbol) => {
            const property = propertydb.get_property(prototype, String(name));
            if (!property) {
                propertydb.add_property(prototype, String(name));
                propertyHandler.manageproperty(prototype, String(name));
            }
            propertydb.add_mutator(mutator, prototype, String(name));
        };
    }

    /**
     * Returns a PropertyDecorator for for adding a subscription to the
     * decorated property.
     */
    public on_change(subscription: ISubscriptionEntry): PropertyDecorator {
        const propertydb = this.propertydb;
        const propertyHandler = this;
        return (prototype: any, name: string | symbol) => {
            const property = propertydb.get_property(prototype, String(name));
            if (!property) {
                propertydb.add_property(prototype, String(name));
                propertyHandler.manageproperty(prototype, String(name));
            }
            propertydb.add_property_subscription(subscription, prototype, String(name));
        };
    }

    /**
     * Returns a getter function to use with the property of the given name.
     */
    private make_getter(name: string): () => any {
        const propertydb = this.propertydb;
        const propertyHandler = this;

        // Return the getter function
        return function(this: any) {
            const prototype = Object.getPrototypeOf(this);
            const property = propertydb.get_property(prototype, name);
            let instance = propertydb.get_dbinstance(this, name);
            let result: any;

            // If the value does not exist then create it.
            if (typeof instance === "undefined") {
                instance = propertydb.add_instance(this, name);
                propertyHandler.apply_subscriptions(instance);
            }

            if (property) {

                // Apply mutators
                result = instance.value;
                for (const mutator of property.mutators) {
                    result = mutator.getter(result);
                }
            }

            return result;
        };
    }

    /**
     * Returns a setter function for a property with the given name.
     */
    private make_setter(name: string): (value: any) => void {
        const propertydb = this.propertydb;
        const propertyHandler = this;
        const eventBus = this.eventBus;

        // return the setter function
        return function(this: any, value: any) {
            const prototype = Object.getPrototypeOf(this);
            const property = propertydb.get_property(prototype, name);
            let instance = propertydb.get_dbinstance(this, name);
            let newvalue: any = value;
            let oldvalue;

            // If the instance does not exist then create it.
            if (typeof instance === "undefined") {
                instance = propertydb.add_instance(this, name);
                propertyHandler.apply_subscriptions(instance);
            }

            if (property) {

                // Apply mutators
                for (const mutator of property.mutators) {
                    newvalue = mutator.setter(newvalue);
                }
            }

            // Update the value and run publish the change to the event bus
            oldvalue = instance.value;
            eventBus.publish("pre-" + instance.id, newvalue, oldvalue);
            instance.value = newvalue;
            eventBus.publish("post-" + instance.id, newvalue, oldvalue);
        };
    }

    /**
     * Adds an [[EventBus]] subscription for each subscription attached to the
     * given instance as well as all subscriptions attached to the [[IProperty]]
     * it belongs to.
     */
    private apply_subscriptions(instance: IInstance): void {

        // Add property subscriptions
        for (const subscriptionEntry of instance.property.subscriptions) {
            this.add_subscription(subscriptionEntry, instance);
        }

        // Add instance subscriptions
        for (const subscriptionEntry of instance.subscriptions) {
            this.add_subscription(subscriptionEntry, instance);
        }
    }

    /**
     * Adds an [[EventBus]] subscription for the given [[ISubscriptionEntry]]
     * and [[IInstance]]
     */
    private add_subscription(subscriptionEntry: ISubscriptionEntry, instance: IInstance): void {
        const channel = subscriptionEntry.type + "-" + instance.id;
        const subscription = {
            callback: subscriptionEntry.callback,
            context: subscriptionEntry.context,
        };
        this.eventBus.subscribe(channel, subscription);
    }

    /**
     * Creates a property with the given name on the given prototype with a
     * getter and setter to manage mutations and event subscriptions.
     */
    private manageproperty(prototype: any, name: string): void {
        Object.defineProperty(prototype, name, {
            get: this.make_getter(name),
            set: this.make_setter(name),
        });
    }
}

// TODO:
// 1. Add prototype level subscriptions (done)
// 2. Add instance level subscriptions
