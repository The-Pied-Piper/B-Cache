import { expect } from "chai";
import "mocha";
import {PropertyHandler} from "../src/triggers/property";
import { ISubscriptionEntry } from "../src/triggers/propertydb";

describe("property", () => {

    // Test the add_mutator function
    describe("add_mutator()", () => {
        it("Should return a working PropertyDecorator", () => {
            const testHandler = new PropertyHandler();
            const mutator = {
                getter: (value: any) => value + 10,
                setter: (value: any) => value * 2,
            };
            class TestClass {
                @testHandler.add_mutator(mutator)
                public testProperty: any;
            }
            const testObject = new TestClass();
            testObject.testProperty = 2;
            expect(testObject.testProperty).to.equal(14);
        });

        it("Should stack together", () => {
            const testHandler = new PropertyHandler();
            const mutator1 = {
                getter: (value: any) => value * 10,
                setter: (value: any) => value * 2,
            };
            const mutator2 = {
                getter: (value: any) => value + 25,
                setter: (value: any) => value + 5,
            };
            // tslint:disable-next-line:max-classes-per-file
            class TestClass {
                @testHandler.add_mutator(mutator1)
                @testHandler.add_mutator(mutator2)
                public testProperty: any;
            }
            const testObject = new TestClass();
            testObject.testProperty = 2;
            expect(testObject.testProperty).to.equal(390);
        });
    });

    // Test the on_change function
    describe("on_change()", () => {
        it("Should return a working PropertyDecorator", () => {
            const testHandler = new PropertyHandler();
            const subscription: ISubscriptionEntry = {
                callback: () => { throw new Error("Callback run"); },
                type: "pre",
            };
            // tslint:disable-next-line:max-classes-per-file
            class TestClass {
                @testHandler.on_change(subscription)
                public testProperty: any;
            }
            const testObject = new TestClass();
            const change = () => {testObject.testProperty = 2; };
            expect(change).to.throw(Error, "Callback run");
        });
    });
});
