import { expect, assert } from 'chai';
import 'mocha';
import { Cell } from '../src/cell';

/**
 * @todo test sanitization of incoming values
 */

describe('Cell', () => {


    // test value property
    describe('value', () => {
        it("Should be undefined in the beginning", () => {
            const cell = new Cell();
            expect(cell.value).to.equal(undefined);
        });
        it("Should accept complex data types", () => {
            let test_val = { a: 'a' }
            const cell = new Cell();
            cell.value = test_val;
            expect(cell.value).to.equal(test_val);
        });
        it("Should not allow setting value to undefined", () => {
            const cell = new Cell();
            cell.value = 1;
            assert.throws(
                () => { cell.value = undefined; },
                Error,
                "Must not set value of cell to undefined"
            );
        });
        it("Should not allow changing the type of value", () => {
            const cell = new Cell();
            cell.value = 1;
            assert.throws(
                () => { cell.value = "1"; },
                Error,
                "Must not change type of cell"
            );
        });
        it("Should prevent setting value to anything other than string|number", () => {
            const cell = new Cell({is_unique:true});
            assert.throws(
                () => { cell.value = {a:5}; },
                Error,
                "An unique cell may only contain values of type 'string' or 'number'"
            );
        });
        it("Should allow changing unique cell's value to string", () => {
            const cell = new Cell({ is_unique: true });
            cell.value = "1";
            expect(cell.value).to.equal("1");
        });
        it("Should allow changing unique cell's value to number", () => {
            const cell = new Cell({ is_unique: true });
            cell.value = 1;
            expect(cell.value).to.equal(1);
        });
        it("Should allow changing nullable cell's value to null", () => {
            const cell = new Cell({ nullable: true });
            cell.value = null;
            expect(cell.value).to.equal(null);
        });
        it("Should not allow changing non-nullable cell's value to null", () => {
            const cell = new Cell({ nullable: false });
            assert.throws(
                () => { cell.value = null; },
                Error,
                "Can not set value of non-nullable cell to null"
            );
        });
    });

    // test the is_unique property
    describe('is_unique', () => {
        it("Should return the value passed to the constructor", () => {
            const cell = new Cell({ is_unique: true });
            expect(cell.is_unique).to.equal(true);
        });
        it("Should default to false", () => {
            const cell = new Cell();
            expect(cell.is_unique).to.equal(false);
        });
        it("Should be read only", () => {
            const cell = new Cell();
            assert.throws(
                () => { cell.is_unique = true; },
                Error,
                "Cannot set property is_unique of #<Cell> which has only a getter"
            );
        });
    });

    // test the dirty property
    describe('dirty', () => {
        it("Should return false before the value is changed", () => {
            const cell = new Cell();
            expect(cell.is_dirty).to.equal(false);
        });
        it("Should be true when we change the value", () => {
            const cell = new Cell();
            cell.value = 123;
            expect(cell.is_dirty).to.equal(true);
        });
        it("Should not set the flag if the value is not changed", () => {
            const cell = new Cell();
            cell.fix_value(1);
            cell.value = 1;
            expect(cell.is_dirty).to.equal(false);
        });
        it("Should be read only", () => {
            const cell = new Cell();
            assert.throws(
                () => { cell.is_dirty = true; },
                Error,
                "Cannot set property is_dirty of #<Cell> which has only a getter"
            );
        });
    });

    // test fix_value() function
    describe('fix_value()', () => {
        it("Should change the value", () => {
            const cell = new Cell();
            cell.fix_value(123);
            expect(cell.value).to.equal(123);
        });
        it("Should not set the is_dirty flag to true", () => {
            const cell = new Cell();
            cell.fix_value(123);
            expect(cell.is_dirty).to.equal(false);
        });
        it("Should allow complex data types", () => {
            const cell = new Cell();
            cell.fix_value({a:123});
            expect(cell.is_dirty).to.equal(false);
        });
        it("Should not allow setting value to undefined", () => {
            const cell = new Cell();
            cell.value = 1;
            assert.throws(
                () => { cell.fix_value(undefined); },
                Error,
                "Must not set value of cell to undefined"
            );
        });
        it("Should not allow changing the type of value", () => {
            const cell = new Cell();
            cell.value = 1;
            assert.throws(
                () => { cell.fix_value("1"); },
                Error,
                "Must not change type of cell"
            );
        });
        it("Should allow changing value to null for nullable cells", () => {
            const cell = new Cell({nullable:true});
            cell.value = 1;
            cell.fix_value(null);
            expect(cell.value).to.equal(null);
        });
        it("Should not allow changing non-nullable cell's value to null", () => {
            const cell = new Cell({ nullable: false });
            assert.throws(
                () => { cell.fix_value(null); },
                Error,
                "Can not set value of non-nullable cell to null"
            );
        });
        it("Should prevent setting value to anything other than string|number", () => {
            const cell = new Cell({ is_unique: true });
            assert.throws(
                () => { cell.fix_value({ a: 5 }); },
                Error,
                "An unique cell may only contain values of type 'string' or 'number'"
            );
        });
        it("Should allow unique cell to be asigned a number", () => {
            const cell = new Cell({ is_unique: true });
            cell.fix_value(222)
            expect(cell.value).to.equal(222);
        });
        it("Should allow unique cell to be asigned a string", () => {
            const cell = new Cell({ is_unique: true });
            cell.fix_value("222")
            expect(cell.value).to.equal("222");
        });
    });

    //test the written function
    describe('written()', () => {
        it("Should set the firty flag to false", () => {
            const cell = new Cell();
            cell.value = 5;
            cell.written();
            expect(cell.is_dirty).to.equal(false);
        });
    });

    //test registering callbacks
    describe("register_callback()", ()=>{
        it("Should run the callback when the value is changed",()=>{
            const cell = new Cell();
            cell.register_change(()=>{throw new Error("Testing that this is called");});
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called"
            );
        });
        it("Should respect context", () => {
            const cell = new Cell();
            let context:any = { err: new Error("Testing that this is called")};
            let err_fn = function(){throw this.err;};
            cell.register_change(err_fn, context);
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called"
            );
        });
        it("Should run the callback multiple times", () => {
            const cell = new Cell();
            cell.register_change(() => { throw new Error("Testing that this is called"); });
            assert.throws(
                () => { cell.value = 1; },
                Error,
                "Testing that this is called"
            );
            assert.throws(
                () => { cell.value = 3; },
                Error,
                "Testing that this is called"
            );
        });
        it("Should not run the callback if the value is not changed", () => {
            const cell = new Cell();
            cell.value = 1;
            cell.register_change(() => { throw new Error("Should not throw this error"); });
            cell.value = 1;
            expect(cell.value).to.equal(1);
        });
        it("Should remove the callback if the returned function is called", () => {
            const cell = new Cell();
            cell.value = 1;
            let stop = cell.register_change(() => { throw new Error("Should not throw this error"); });
            stop();
            cell.value = 2;
            expect(cell.value).to.equal(2);
        });
    });

    //test the constructor
    describe('new Cell()', () => {
        it("Should not allow non-boolean arguments for is_unique", () => {
            assert.throws(
                () => { const cell = new Cell({ is_unique: "" }); },
                Error,
                "Argument of type 'string' is not assignable to is_unique"
            );
        });
        it("Should not allow non-boolean arguments for nullable", () => {
            assert.throws(
                () => { const cell = new Cell({ nullable: "" }); },
                Error,
                "Argument of type 'string' is not assignable to nullable"
            );
        });
        it("Should set is_unique to false by default", () => {
            const cell = new Cell();
            expect(cell._is_unique).to.equal(false);
        });
        it("Should set nullable to true by default", () => {
            const cell = new Cell();
            expect(cell._nullable).to.equal(true);
        });
    });
});