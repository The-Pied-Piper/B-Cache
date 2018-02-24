import { assert, expect } from "chai";
import "mocha";
import { Cell } from "../src/cell";

/**
 * @todo Add tests for the test callback.
 */

describe("Cell", () => {

    // test value property
    describe("value", () => {
        it("Should be undefined in the beginning", () => {
            const cell = new Cell( () => true);
            expect(cell.value).to.equal(undefined);
        });
        it("Should accept complex data types", () => {
            const testval = { a: "a" };
            const cell = new Cell( () => true);
            cell.value = testval;
            expect(cell.value).to.equal(testval);
        });
    });

    // test the dirty property
    describe("dirty", () => {
        it("Should return false before the value is changed", () => {
            const cell = new Cell( () => true);
            expect(cell.isDirty).to.equal(false);
        });
        it("Should be true when we change the value", () => {
            const cell = new Cell( () => true);
            cell.value = 123;
            expect(cell.isDirty).to.equal(true);
        });
        it("Should not set the flag if the value is not changed", () => {
            const cell = new Cell( () => true);
            cell.fix_value(1);
            cell.value = 1;
            expect(cell.isDirty).to.equal(false);
        });
        it("Should be read only", () => {
            const cell = new Cell( () => true) as any;
            assert.throws(
                () => { cell.isDirty = true; },
                Error,
                "Cannot set property isDirty of #<Cell> which has only a getter",
            );
        });
    });

    // test fix_value() function
    describe("fix_value()", () => {
        it("Should change the value", () => {
            const cell = new Cell( () => true);
            cell.fix_value(123);
            expect(cell.value).to.equal(123);
        });
        it("Should not set the isDirty flag to true", () => {
            const cell = new Cell( () => true);
            cell.fix_value(123);
            expect(cell.isDirty).to.equal(false);
        });
        it("Should allow complex data types", () => {
            const cell = new Cell( () => true);
            cell.fix_value({ a: 123 });
            expect(cell.isDirty).to.equal(false);
        });
    });

    // test the written function
    describe("written()", () => {
        it("Should set the firty flag to false", () => {
            const cell = new Cell( () => true);
            cell.value = 5;
            cell.written();
            expect(cell.isDirty).to.equal(false);
        });
    });

    // test registering callbacks
    describe("register_callback()", () => {
        it("Should run the callback when the value is changed", () => {
            const cell = new Cell( () => true);
            cell.register_change(() => { throw new Error("Testing that this is called"); });
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called",
            );
        });
        it("Should respect context", () => {
            const cell = new Cell( () => true);
            const context: any = { err: new Error("Testing that this is called") };
            const errFn = function() { throw this.err; };
            cell.register_change(errFn, context);
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called",
            );
        });
        it("Should run the callback multiple times", () => {
            const cell = new Cell( () => true);
            cell.register_change(() => { throw new Error("Testing that this is called"); });
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called",
            );
            assert.throws(
                () => { cell.value = 3; },
                Error,
                "Testing that this is called",
            );
        });
        it("Should not run the callback if the value is not changed", () => {
            const cell = new Cell( () => true);
            cell.value = 1;
            cell.register_change(() => { throw new Error("Should not throw this error"); });
            cell.value = 1;
            expect(cell.value).to.equal(1);
        });
        it("Should remove the callback if the returned function is called", () => {
            const cell = new Cell( () => true);
            cell.value = 1;
            const stop = cell.register_change(() => { throw new Error("Should not throw this error"); });
            stop();
            cell.value = 2;
            expect(cell.value).to.equal(2);
        });
    });

    // Test the value test callback
    describe("Value testing callback", () => {
        it("Should be called when the value is set", () => {
            const cell = new Cell(
                () => { throw new Error("Testing that this is called"); },
            );
            expect(() => { cell.value = 5; }).to.throw("Testing that this is called");
        });
        it("Should be called when the value is fixed", () => {
            const cell = new Cell(
                () => { throw new Error("Testing that this is called"); },
            );
            expect(() => { cell.fix_value(5); }).to.throw("Testing that this is called");
        });
    });
});
