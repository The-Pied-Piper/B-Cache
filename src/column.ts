import { Cell } from "./cell";

/**
 * This class is used to store user defined properties for a column in a table.
 * A column is a grouping of cells that all represent the same attribute of a
 * larger data structure.
 *
 * Columns are used to define models (user defined data structures).
 */
export class Column {
    /**
     * Stores whether this column stores an id
     */
    private id: boolean;

    /**
     * Stores whether this column needs to be unique
     */
    private isUnique: boolean;

    /**
     * stores whether this column needs to be auto incremented
     */
    private autoInc: boolean;

    /**
     * Stores the type of data this column needs to store.
     */
    private colType: string;

    /**
     * Stores whether this column's cell are nullable
     */
    private isNullable: boolean;

    /**
     * Creates a new instance of a Column.
     */
    constructor({
        isID = false,
        unique,
        autoIncrement = false,
        nullable,
        type,
    }:
        {
            isID?: boolean,
            unique?: boolean,
            autoIncrement?: boolean,
            nullable?: boolean,
            type?: string,
        } = {},
    ) {
        // Test that incoming values are coherent
        this._sanitise_constructor_autoIncrement(autoIncrement, type);
        this._sanitise_constructor_isID(isID);
        this._sanitise_constructor_nullable(nullable, isID);
        this._sanitise_constructor_unique(unique, isID);
        this._sanitise_constructor_type(type, unique, isID);

        // Set instance attribute values from constructor arguments
        this.isNullable = nullable;
        this.autoInc = autoIncrement;
        this.id = isID;
        this.isUnique = unique === false ? false : unique || isID;
        this.isNullable = this.isID ? false : ( nullable === undefined ? true : nullable);
        this.colType = autoIncrement ? "number" : type;
    }

    /**
     * Returns whether this cell is nullable or not
     */
    public get nullable(): boolean {
        return this.isNullable;
    }

    /**
     * Returns the type of this column if one was set and undefined otherwise
     */
    public get type(): string {
        return this.colType;
    }

    /**
     * Returns true if this column is an id and false otherwise
     */
    public get isID(): boolean {
        return this.id;
    }

    /**
     * Returns true if the values in this column must be unique and false
     * otherwise
     */
    public get unique(): boolean {
        return this.isUnique;
    }

    /**
     * Returns true if the values in this column must be auto incremented and
     * false otherwise
     */
    public get autoIncrement(): boolean {
        return this.autoInc;
    }

    /**
     * Returns a cell with the properties for this column
     */
    public cell_factory(): Cell {
        return new Cell((value) => { this._cell_value_tester.call(this, value); });
    }

    /**
     * Makes sure incoming values don't break any rules
     */
    private _cell_value_tester(v: any): void {

        // set the columns type if it was not previously set
        this._set_type(v);

        // do not set value to undefined
        if (v === undefined) {
            throw new Error("Must not set value of cell to undefined");
        }

        // Don't set non-nullable cells to nullable
        if (v === null && !this.nullable) {
            throw new Error("Can not set value of non-nullable cell to null");
        }

        // Don't change types unless setting to null
        if (this.type && typeof v !== this.type && v !== null) {
            throw new Error("Must not change type of cell");
        }
    }

    /**
     * Sets the column's [[colType]] if it was not set already
     */
    private _set_type(value: any) {
        if (!this.type && value !== null) {

            // Disallow setting unique columns to anything other than string or number
            if (this.unique && typeof value !== "string" && typeof value !== "number") {
                throw new Error("The type of a unique column can only be a string or number");
            }

            this.colType = typeof value;
        }
    }

    /**
     * Makes sure that incoming constructor arguments are of the correct type
     * and are consistent
     */
    private _sanitise_constructor_autoIncrement(
        autoIncrement: boolean,
        type: string,
    ): void {

        // Make sure autoIncrement is of type boolean
        if (typeof autoIncrement !== "boolean") {
            throw new Error("Argument of type '" + typeof autoIncrement + "' is not " +
                "assignable to autoIncrement");
        }

        // Make sure autoIncrement is not set on a non number column
        if (autoIncrement && type && type !== "number") {
            throw new Error("Can not set auto increment for non number columns");
        }
    }

    /**
     * Makes sure the value for isID given to the constructor is valid
     */
    private _sanitise_constructor_isID(isID: boolean) {
        if (typeof isID !== "boolean") {
            throw new Error("Argument of type '" + typeof isID + "' is not " +
                "assignable to isID");
        }
    }

    /**
     * Makes sure the value for unique given to the constructor is valid
     */
    private _sanitise_constructor_unique(unique: boolean, isID: boolean) {

        // Make sure it is of type boolean
        if (unique && typeof unique !== "boolean") {
            throw new Error("Argument of type '" + typeof unique + "' is not " +
                "assignable to unique");
        }

        // Make sure ID column does not get unique set to false
        if (isID && unique === false) {
            throw new Error("ID column must be unique");
        }
    }

    /**
     * Makes sure the value for type given to the constructor is valid
     */
    private _sanitise_constructor_type(type: string, unique: boolean, isID: boolean) {

        // Make sure the type of type is a string
        if (type && typeof type !== "string") {
            throw new Error(
                "Argument of type '" + typeof type + "' is not assignable to type");
        }

        // Unique and ID columns can only be strings or numbers
        if (type && (unique || isID) && (type !== "string" && type !== "number")) {
            throw new Error(
                "The type of a unique column can only be a string or number",
            );
        }
    }

    /**
     * Makes sure the value for nullable given to the constructor is valid
     */
    private _sanitise_constructor_nullable(nullable: boolean, isID: boolean) {

        // Make sure nullabe is of type boolean
        if (nullable && typeof nullable !== "boolean") {
            throw new Error(
                "Argument of type '" + typeof nullable + "' is not assignable to nullable");
        }

        // Make sure ID column is not nullable
        if (isID && nullable === true) {
            throw new Error("ID column can not be nulled");
        }
    }
}
