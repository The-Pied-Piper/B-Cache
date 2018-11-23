import { expect } from "chai";
import "mocha";
import { ISubscriptionEntry, PropertyDatabase } from "../src/triggers/propertydb";

class TestClass {
    public testAttribute: any;
}

describe("PropertyDatabase", () => {

    // test the add_property function
    describe("add_property()", () => {
        it("Should add the property to the list of entries", () => {
            const db = new PropertyDatabase() as any;
            db.add_property({}, "test");
            expect(db.entries[0].properties.test).to.not.equal(undefined);
        });
        it("Should return the newly created property", () => {
            const db = new PropertyDatabase() as any;
            const property = db.add_property({}, "test");
            expect(db.entries[0].properties.test).to.equal(property);
        });
        it("Should throw an error if the property already exists", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const add = () => { db.add_property(prototype, "test"); };
            expect(add).to.throw(Error, "Property already exists");
        });
        it("Should throw an error if the property name is not a string", () => {
            const db = new PropertyDatabase() as any;
            const prototype = {};
            const add = () => { db.add_property(prototype, 1); };
            expect(add).to.throw(
                Error,
                "The name of the property must be a string",
            );
        });
    });

    // Test the add_instance function
    describe("add_instance()", () => {

        it("Should add the instance to the list of instances for the property", () => {
            const db = new PropertyDatabase();
            const property = db.add_property(TestClass.prototype, "test");
            db.add_instance(new TestClass(), "test");
            expect(property.instances[0]).to.not.equal(undefined);
        });
        it("Should return the newly created instance", () => {
            const db = new PropertyDatabase();
            const property = db.add_property(TestClass.prototype, "test");
            const instance = db.add_instance(new TestClass(), "test");
            expect(property.instances[0]).to.equal(instance);
        });
        it("Should throw an error if the property doesn't exists", () => {
            const db = new PropertyDatabase();
            const add = () => { db.add_instance(new TestClass(), "test"); };
            expect(add).to.throw(Error, "Property does not exist");
        });
        it("Should throw an error if the instance already exists", () => {
            const db = new PropertyDatabase();
            db.add_property(TestClass.prototype, "test");
            const testObject = new TestClass();
            db.add_instance(testObject, "test");
            const add = () => { db.add_instance(testObject, "test"); };
            expect(add).to.throw(
                Error,
                "The property is already attached to this instance",
            );
        });
    });

    // Test the add_mutator function
    describe("add_mutator()", () => {
        it("Should add the mutator to the list of mutators for the property", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            const property = db.add_property(prototype, "test");
            const mutator = {
                getter: () => undefined,
                setter: () => undefined,
            };
            db.add_mutator(mutator, prototype, "test");
            expect(property.mutators[0]).to.equal(mutator);
        });
        it("Should throw an error if the property does not exist", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            const mutator = {
                getter: () => undefined,
                setter: () => undefined,
            };
            const add = () => { db.add_mutator(mutator, prototype, "test"); };
            expect(add).to.throw(Error, "Property does not exist");
        });
        it("Should throw an error if the setter is not a function", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const mutator = {
                getter: () => undefined,
                setter: 1,
            } as any;
            const add = () => { db.add_mutator(mutator, prototype, "test"); };
            expect(add).to.throw(Error, "Setter must be a function");
        });
        it("Should throw an error if the setter does not exist", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const mutator = {
                getter: () => undefined,
            } as any;
            const add = () => { db.add_mutator(mutator, prototype, "test"); };
            expect(add).to.throw(Error, "Setter must be a function");
        });
        it("Should throw an error if the getter is not a function", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const mutator = {
                getter: 1,
                setter: () => undefined,
            } as any;
            const add = () => { db.add_mutator(mutator, prototype, "test"); };
            expect(add).to.throw(Error, "Getter must be a function");
        });
        it("Should throw an error if the getter does not exist", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const mutator = {
                setter: () => undefined,
            } as any;
            const add = () => { db.add_mutator(mutator, prototype, "test"); };
            expect(add).to.throw(Error, "Getter must be a function");
        });
    });

    // Test the add_property_subscription function
    describe("add_property_subscription()", () => {
        it("Should add the 'pre' subscription to the list of subscriptions for the property", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            const property = db.add_property(prototype, "test");
            const subscription: ISubscriptionEntry = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "pre",
            };
            db.add_property_subscription(subscription, prototype, "test");
            expect(property.subscriptions[0]).to.equal(subscription);
        });
        it("Should add the 'post' subscription to the list of subscriptions for the property", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            const property = db.add_property(prototype, "test");
            const subscription: ISubscriptionEntry = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "post",
            };
            db.add_property_subscription(subscription, prototype, "test");
            expect(property.subscriptions[0]).to.equal(subscription);
        });
        it("Should throw an error type is not pre nor post", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const subscription: any = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "asdf",
            };
            const add = () => {
                db.add_property_subscription(subscription, prototype, "test");
            };
            expect(add).to.throw(
                Error,
                "The subscription must be of type 'pre' or 'post'",
            );
        });
        it("Should throw an error if the callback is not a function", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const subscription: any = {
                callback: 1,
                type: "post",
            };
            const add = () => {
                db.add_property_subscription(subscription, prototype, "test");
            };
            expect(add).to.throw(
                Error,
                "Subscription's callback must be a function",
            );
        });
        it("Should throw an error if the callback is not included", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const subscription: any = {
                type: "post",
            };
            const add = () => {
                db.add_property_subscription(subscription, prototype, "test");
            };
            expect(add).to.throw(
                Error,
                "Subscription's callback must be a function",
            );
        });
        it("Should throw an error if the type is not included", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            const subscription: any = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
            };
            const add = () => {
                db.add_property_subscription(subscription, prototype, "test");
            };
            expect(add).to.throw(
                Error,
                "The subscription must be of type 'pre' or 'post'",
            );
        });
    });

    // Test the add_instance_subscription function
    describe("add_property_subscription()", () => {
        it("Should add the 'pre' subscription to the list of subscriptions for the instance", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            const dbInstance = db.add_instance(testInstance, "test");
            const subscription: ISubscriptionEntry = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "pre",
            };
            db.add_instance_subscription(subscription, testInstance, "test");
            expect(dbInstance.subscriptions[0]).to.equal(subscription);
        });
        it("Should add the 'post' subscription to the list of subscriptions for the property", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            const dbInstance = db.add_instance(testInstance, "test");
            const subscription: ISubscriptionEntry = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "post",
            };
            db.add_instance_subscription(subscription, testInstance, "test");
            expect(dbInstance.subscriptions[0]).to.equal(subscription);
        });
        it("Should throw an error type is not pre nor post", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            db.add_instance(testInstance, "test");
            const subscription: any = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
                type: "asdf",
            };
            const add = () => {
                db.add_instance_subscription(subscription, testInstance, "test");
            };
            expect(add).to.throw(
                Error,
                "The subscription must be of type 'pre' or 'post'",
            );
        });
        it("Should throw an error if the callback is not a function", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            db.add_instance(testInstance, "test");
            const subscription: any = {
                callback: 1,
                type: "post",
            };
            const add = () => {
                db.add_instance_subscription(subscription, testInstance, "test");
            };
            expect(add).to.throw(
                Error,
                "Subscription's callback must be a function",
            );
        });
        it("Should throw an error if the callback is not included", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            db.add_instance(testInstance, "test");
            const subscription: any = {
                type: "post",
            };
            const add = () => {
                db.add_instance_subscription(subscription, testInstance, "test");
            };
            expect(add).to.throw(
                Error,
                "Subscription's callback must be a function",
            );
        });
        it("Should throw an error if the type is not included", () => {
            const testInstance = new TestClass();
            const db = new PropertyDatabase();
            const prototype = TestClass.prototype;
            db.add_property(prototype, "test");
            db.add_instance(testInstance, "test");
            const subscription: any = {
                callback: () => { if (true) { throw new Error("Callback was run"); } },
            };
            const add = () => {
                db.add_instance_subscription(subscription, testInstance, "test");
            };
            expect(add).to.throw(
                Error,
                "The subscription must be of type 'pre' or 'post'",
            );
        });
    });

    // Test the get_dbinstance function
    describe("get_dbinstance()", () => {
        it("Should return the required IInstance object", () => {
            const db = new PropertyDatabase();
            const testInstance = new TestClass();
            db.add_property(TestClass.prototype, "test");
            const dbinstance = db.add_instance(testInstance, "test");
            expect(db.get_dbinstance(testInstance, "test")).to.equal(dbinstance);
        });
        it("Should return undefined if the property does not exist", () => {
            const db = new PropertyDatabase();
            const testInstance = new TestClass();
            db.add_property(TestClass.prototype, "test");
            db.add_instance(testInstance, "test");
            expect(db.get_dbinstance(testInstance, "asdf")).to.equal(undefined);
        });
        it("Should return undefined if the instance does not exist", () => {
            const db = new PropertyDatabase();
            const testInstance = new TestClass();
            db.add_property(TestClass.prototype, "test");
            db.add_instance(testInstance, "test");
            expect(db.get_dbinstance(new TestClass(), "test")).to.equal(undefined);
        });
    });

    // Test the get_dbinstance_by_id function
    describe("get_dbinstance_by_id()", () => {
        it("Should return the required IInstance object", () => {
            const db = new PropertyDatabase();
            const testInstance = new TestClass();
            db.add_property(TestClass.prototype, "test");
            const dbinstance = db.add_instance(testInstance, "test");
            expect(db.get_dbinstance_by_id(dbinstance.id)).to.equal(dbinstance);
        });
        it("Should return undefined if the property does not exist", () => {
            const db = new PropertyDatabase();
            const testInstance = new TestClass();
            db.add_property(TestClass.prototype, "test");
            const dbinstance = db.add_instance(testInstance, "test");
            expect(db.get_dbinstance_by_id(dbinstance.id + 1)).to.equal(undefined);
        });
    });

    // Test the get_property function
    describe("get_property()", () => {
        it("Should return the required IProperty object", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            const property = db.add_property(prototype, "test");
            expect(db.get_property(prototype, "test")).to.equal(property);
        });
        it("Should return undefined if the property does not exist", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            expect(db.get_property(prototype, "asdf")).to.equal(undefined);
        });
        it("Should return undefined if the entry does not exist", () => {
            const db = new PropertyDatabase();
            const prototype = {};
            db.add_property(prototype, "test");
            expect(db.get_property({}, "test")).to.equal(undefined);
        });
    });
});
