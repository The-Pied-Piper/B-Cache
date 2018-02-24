import { assert, expect } from "chai";
import "mocha";
import { Cell } from "../src/cell";
import { Column } from "../src/column";

describe("Column", () => {

    // Test constructor
    describe("new Column()", () => {

        // Test nullable argument
        it("Should set nullable property from argument", () => {
            const col = new Column({ nullable: false });
            expect(col.nullable).to.equal(false);
        });
        it("Should not allow ID columns to be nullable", () => {
            assert.throws(
                () => { const col = new Column({ isID: true, nullable: true }); },
                Error,
                "ID column can not be nulled",
            );
        });
        it("Should set nullable to true by default", () => {
            const col = new Column();
            expect(col.nullable).to.equal(true);
        });
        it("Should be fine with isID = true and nullable = false", () => {
            const col = new Column({ isID: true, nullable: false });
            expect(col.nullable).to.equal(false);
        });
        it("Should set nullable to false for ID columns by default", () => {
            const col = new Column({ isID: true });
            expect(col.nullable).to.equal(false);
        });
        it("Should throw an error if typeof nullabe is not boolean", () => {
            assert.throws(
                () => { const col = new Column({ nullable: 1 as any }); },
                Error,
                "Argument of type 'number' is not assignable to nullable",
            );
        });

        // Test unique argument
        it("Should set unique property from argument", () => {
            const col = new Column({ unique: true });
            expect(col.unique).to.equal(true);
        });
        it("Should not allow ID columns to be not unique", () => {
            assert.throws(
                () => { const a = new Column({ isID: true, unique: false }); },
                Error,
                "ID column must be unique",
            );
        });
        it("Should throw an error if typeof unique is not boolean", () => {
            assert.throws(
                () => { const col = new Column({ unique: 1 as any }); },
                Error,
                "Argument of type 'number' is not assignable to unique",
            );
        });
        it("Should set unique to false by default", () => {
            const col = new Column();
            expect(col.unique).to.equal(false);
        });
        it("Should set unique to true for ID columns by default", () => {
            const col = new Column({ isID: true });
            expect(col.unique).to.equal(true);
        });
        it("Should work if isID and unique are both set to truw", () => {
            const col = new Column({ isID: true, unique: true });
            expect(col.unique).to.equal(true);
        });

        // Test argument type
        it("Should set type property from argument", () => {
            const col = new Column({ type: "Object" });
            expect(col.type).to.equal("Object");
        });
        it("Should set type to undefined by default", () => {
            const col = new Column();
            expect(col.type).to.equal(undefined);
        });
        it("Should not allow non string or number or undefined type for ID columns", () => {
            assert.throws(
                () => { const col = new Column({ isID: true, type: "boolean" }); },
                Error,
                "The type of a unique column can only be a string or number",
            );
        });
        it("Should not allow non string or number or undefined type for unique columns", () => {
            assert.throws(
                () => { const col = new Column({ unique: true, type: "boolean" }); },
                Error,
                "The type of a unique column can only be a string or number",
            );
        });
        it("Should be ok with 'string' for type of unique columns", () => {
            const col = new Column({ unique: true, type: "string" });
            expect(col.type).to.equal("string");
        });
        it("Should be ok with 'number' for type of unique columns", () => {
            const col = new Column({ unique: true, type: "number" });
            expect(col.type).to.equal("number");
        });
        it("Should be ok with 'string' for type of ID columns", () => {
            const col = new Column({ isID: true, type: "string" });
            expect(col.type).to.equal("string");
        });
        it("Should be ok with 'number' for type of ID columns", () => {
            const col = new Column({ isID: true, type: "number" });
            expect(col.type).to.equal("number");
        });
        it("Should be ok with undefined for type of unique columns", () => {
            const col = new Column({ isID: true });
            expect(col.type).to.equal(undefined);
        });
        it("Should be ok with undefined for type of ID columns", () => {
            const col = new Column({ isID: true });
            expect(col.type).to.equal(undefined);
        });
        it("Should throw an error if typeof type is not a string", () => {
            assert.throws(
                () => { const col = new Column({ type: 1 as any }); },
                Error,
                "Argument of type 'number' is not assignable to type",
            );
        });
        it("Should set type to number if autoIncrement is given", () => {
            const col = new Column({ autoIncrement: true });
            expect(col.type).to.equal("number");
        });
        it("Should be fine if autoIncrement is true and type is 'number'", () => {
            const col = new Column({ autoIncrement: true, type: "number" });
            expect(col.type).to.equal("number");
        });

        // Test isID argument
        it("Should set isID property from argument", () => {
            const col = new Column({ isID: true });
            expect(col.isID).to.equal(true);
        });
        it("Should set isID to false by default", () => {
            const col = new Column();
            expect(col.isID).to.equal(false);
        });
        it("Should throw an error if typeof isID is not boolean", () => {
            assert.throws(
                () => { const col = new Column({ isID: 1 as any }); },
                Error,
                "Argument of type 'number' is not assignable to isID",
            );
        });

        // Test autoIncrement
        it("Should set autoIncrement property from argument", () => {
            const col = new Column({ autoIncrement: true });
            expect(col.autoIncrement).to.equal(true);
        });
        it("Should set autoIncrement to false by default", () => {
            const col = new Column();
            expect(col.autoIncrement).to.equal(false);
        });
        it("Should throw an error if typeof autoIncrement is not boolean", () => {
            assert.throws(
                () => { const col = new Column({ autoIncrement: 1 as any }); },
                Error,
                "Argument of type 'number' is not assignable to autoIncrement",
            );
        });
        it("Should throw an error if autoIncrement is true and type is not 'number'", () => {
            assert.throws(
                () => { const col = new Column({ autoIncrement: true, type: "string" }); },
                Error,
                "Can not set auto increment for non number columns",
            );
        });
    });

    // Test the _sanatise_incoming_value function
    describe("_cell_value_tester()", () => {
        it("Should set column type if it was not previously set", () => {
            const col = new Column() as any;
            col._cell_value_tester({});
            expect(col.type).to.equal("object");
        });
        it("Should not allow undefined values", () => {
            const col = new Column() as any;
            assert.throws(
                () => { col._cell_value_tester(undefined); },
                Error,
                "Must not set value of cell to undefined",
            );
        });
        it("Should not allow non-nullable columns to be nulled", () => {
            const col = new Column({ nullable: false }) as any;
            assert.throws(
                () => { col._cell_value_tester(null); },
                Error,
                "Can not set value of non-nullable cell to null",
            );
        });
        it("Should allow nullable columns to be nulled", () => {
            const col = new Column({ nullable: true }) as any;
            col._cell_value_tester(null);
        });
        it("Should not allow type to be changed", () => {
            const col = new Column({ type: "number" }) as any;
            assert.throws(
                () => { col._cell_value_tester("5"); },
                Error,
                "Must not change type of cell",
            );
        });
        it("Should allow values of matching type", () => {
            const col = new Column({ type: "number" }) as any;
            col._cell_value_tester(5);
        });
        it("Should not set type when value is null", () => {
            const col = new Column({ nullable: true }) as any;
            col._cell_value_tester(null);
            expect(col.type).to.equal(undefined);
        });
        it("Should not allow unique column's type to be anything but string or number", () => {
            const col = new Column({ unique: true }) as any;
            assert.throws(
                () => { col._cell_value_tester({}); },
                Error,
                "The type of a unique column can only be a string or number",
            );
        });
        it("Should not allow ID column's type to be anything but string or number", () => {
            const col = new Column({ isID: true }) as any;
            assert.throws(
                () => { col._cell_value_tester(true); },
                Error,
                "The type of a unique column can only be a string or number",
            );
        });
        it("Should allow setting unique columns type to number", () => {
            const col = new Column({ unique: true }) as any;
            col._cell_value_tester(5);
            expect(col.type).to.equal("number");
        });
        it("Should allow setting unique columns type to string", () => {
            const col = new Column({ unique: true }) as any;
            col._cell_value_tester("5");
            expect(col.type).to.equal("string");
        });
        it("Should allow setting ID columns type to number", () => {
            const col = new Column({ isID: true }) as any;
            col._cell_value_tester(5);
            expect(col.type).to.equal("number");
        });
        it("Should allow setting ID columns type to string", () => {
            const col = new Column({ isID: true }) as any;
            col._cell_value_tester("5");
            expect(col.type).to.equal("string");
        });
    });

    // Test the cell_factory function
    describe("cell_factory()", () => {
        it("Should return a Cell", () => {
            const col = new Column();
            expect(col.cell_factory()).to.be.instanceOf(Cell);
        });

        it("Should pass the _cell_value_tester to the constructor", () => {
            const col = new Column() as any;
            col._cell_value_tester = () => { throw new Error("Here I am"); };
            const cell = col.cell_factory();
            expect(cell.test).throws("Here I am");
        });
    });
});
