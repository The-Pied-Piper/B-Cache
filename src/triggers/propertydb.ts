/**
 * The property database is used to hold a list of properties that are being
 * managed by the property handler.
 */

/**
 * Subscriptions are callbacks that need to be run when the value of a property
 * is changed. There are 2 types of subscriptions
 * - pre: These subscriptions are run before the change is applied to the value
 * - post: These subscriptions are run after the change is applied to the value
 */
export interface ISubscriptionEntry {
    type: "pre" | "post";
    callback: (...args: any[]) => void;
    context?: any;
}

/**
 * A property database entry consists of a prototype to attach properties to as
 * well as a list of properties attached to the prototype
 */
interface IPropertyDatabaseEntry {
    /**
     * The prototype the add the properties to
     */
    prototype: any;

    /**
     * All the properties for this prototype
     */
    properties: { [name: string]: IProperty };
}

/**
 * Holds data for each property that the property handler manages.
 */
interface IProperty {
    /**
     * The default value for the property
     */
    def: any;

    /**
     * Holds subscriptions that should be applied to all instances for this
     * property.
     */
    subscriptions: ISubscriptionEntry[];

    /**
     * The list of mutators to apply to the property
     */
    mutators: IMutator[];

    /**
     * An entry for each instance this property is attached to
     */
    instances: IInstance[];
}

/**
 * A mutator is a pair of functions. The setter mutator changes the value before
 * storing it and the getter changes the value before retrieving it.
 *
 * For example one might wish to save an image object by storing its url. In
 * this case the setter mutator will take an image element and return its src
 * url while the getter mutator will return an image element with the src set as
 * the stored url.
 */
export interface IMutator {
    setter: (value: any) => any;
    getter: (value: any) => any;
}

/**
 * Stores data for a specific instance of an object that a property is attached
 * to
 */
export interface IInstance {
    /**
     * The unique id for this instance.
     */
    id: number;

    /**
     * Holds the subscrptions to run when the value for this instance is changed
     */
    subscriptions: ISubscriptionEntry[];

    /**
     * The instance the property is attached to
     */
    instance: any;

    /**
     * The value of the property for this instance
     */
    value: any;

    /**
     * The property this instance IInstance is associated with.
     */
    property: IProperty;
}

export class PropertyDatabase {
    private entries: IPropertyDatabaseEntry[] = [];
    private id: number = -1;

    /**
     * Adds the property to the property database and returns the newly created
     * [[IProperty]] object. Will throw an error if the property already exists.
     */
    public add_property(prototype: any, name: string, def?: any): IProperty {
        let prototypeEntry: IPropertyDatabaseEntry | undefined;
        let property: IProperty;

        // get the prototype's entry from the db and create it if needed
        prototypeEntry = this.get_entry(prototype);
        if (!prototypeEntry) {
            prototypeEntry = { prototype, properties: {} };
            this.entries.push(prototypeEntry);
        }

        // make sure name is a string
        if (typeof name !== "string") {
            throw new Error("The name of the property must be a string");
        }

        // make sure property does not already exist
        if (this.get_property(prototype, name)) {
            throw new Error("Property already exists");
        }

        // Create the property then add it to the db
        property = { mutators: [], instances: [], def, subscriptions: [] };
        prototypeEntry.properties[name] = property;

        return property;
    }

    /**
     * Adds an [[IInstance]] to the database for the given property and instance
     * then returns the newly created [IInstance] object. Will throw an
     * exception if the property does not exist or if the instance already has a
     * value associated with the given property.
     */
    public add_instance(instance: any, propertyName: string): IInstance {
        const prototype = Object.getPrototypeOf(instance);
        const property = this.get_property(prototype, propertyName);
        let dbInstance: IInstance;

        // If the property does not exist in the database then throw an error
        if (!property) {
            throw new Error("Property does not exist");
        }

        // Throw an error if the instance already exists in the database
        if (this.get_dbinstance(instance, propertyName)) {
            throw new Error("The property is already attached to this instance");
        }

        // Create then add the instance to the db
        dbInstance = {
            id: (++this.id),
            instance,
            property,
            subscriptions: [],
            value: property.def,
        };
        property.instances.push(dbInstance);

        return dbInstance;
    }

    /**
     * Adds the given mutator to given property
     */
    public add_mutator(mutator: IMutator, prototype: any, propertyName: string): void {
        const property = this.get_property(prototype, propertyName);

        // If the property does not exist in the database then throw an error
        if (!property) {
            throw new Error("Property does not exist");
        }

        // make sure mutator has correct structure
        if (typeof mutator.setter !== "function") {
            throw new Error("Setter must be a function");
        } else if (typeof mutator.getter !== "function") {
            throw new Error("Getter must be a function");
        }

        // Add it to the list of mutators
        property.mutators.push(mutator);
    }

    public add_property_subscription(
        subscription: ISubscriptionEntry,
        prototype: any,
        propertyName: string,
    ): void {
        const property = this.get_property(prototype, propertyName);

        // If the property does not exist in the database then throw an error
        if (!property) {
            throw new Error("Property does not exist");
        }

        // Make sure the subscription has the corrent structure
        if (subscription.type !== "pre" && subscription.type !== "post") {
            throw new Error("The subscription must be of type 'pre' or 'post'");
        } else if (typeof subscription.callback !== "function") {
            throw new Error("Subscription's callback must be a function");
        }

        // Add the subscription to the list of subscriptions.
        property.subscriptions.push(subscription);

    }

    public add_instance_subscription(
        subscription: ISubscriptionEntry,
        instance: any,
        propertyName: string,
    ): void {
        const dbinstance = this.get_dbinstance(instance, propertyName);

        // If the instance does not exist in the db throw an error
        if (!dbinstance) {
            throw new Error("Instance does not exist");
        }

        // Make sure the subscription has the corrent structure
        if (subscription.type !== "pre" && subscription.type !== "post") {
            throw new Error("The subscription must be of type 'pre' or 'post'");
        } else if (typeof subscription.callback !== "function") {
            throw new Error("Subscription's callback must be a function");
        }

        // Add the subscription to the list of subscriptions.
        dbinstance.subscriptions.push(subscription);
    }

    /**
     * Returns the [[IInstance]] object from the database associated with this
     * instance and property.
     */
    public get_dbinstance(instance: any, propertyName: string): IInstance | undefined {
        const prototype = Object.getPrototypeOf(instance);
        const property = this.get_property(prototype, propertyName);

        if (property) { // Make sure property exists in the database

            // look for the given instance.
            for (const dbinstance of property.instances) {
                if (dbinstance.instance === instance) {
                    return dbinstance;
                }
            }
        }
        return undefined;
    }

    /**
     * Returns the [[IInstance]] object from the database associated with this
     * id.
     */
    public get_dbinstance_by_id(id: number): IInstance | undefined {
        for (const entry of this.entries) {
            for (const propertyName in entry.properties) {
                if (entry.properties.hasOwnProperty(propertyName)) {
                    const property = entry.properties[propertyName];
                    for (const instance of property.instances) {
                        if (instance.id === id) {
                            return instance;
                        }
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * Returns the property with the given name for the given prototype
     */
    public get_property(prototype: any, name: string): IProperty | undefined {
        const entry = this.get_entry(prototype);
        if (typeof entry !== "undefined") {
            return entry.properties[name];
        }
        return undefined;
    }

    /**
     * Returns the entry for the given prototype from the database
     */
    private get_entry(prototype: any): IPropertyDatabaseEntry | undefined {
        for (const entry of this.entries) {
            if (entry.prototype === prototype) {
                return entry;
            }
        }
        return undefined;
    }
}
