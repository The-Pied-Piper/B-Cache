
import { cell_change_callback } from "./index";

/**
 * A Cell is the smallest unit of data in the database. A [[Row]] is made of
 * one or more cells and a [[Table]] is made of one or more rows.
 *
 * The value of a cell is stored in its value property. A cell can hold any
 * type of value in its value property except for unique cells which must hold
 * either numbers or strings.
 */
export class Cell {

    /**
     * Holds the value of the cell. This can be of any type so long as the cell
     * does not have the [[unique]] flag set to true. If the cell is an
     * unique cell then the value must be of type string or number
     */
    private val: any;

    /**
     * True if the value of the cell has been changed but not yet written false
     * otherwise.
     *
     * @note: It is possible to change the value of the cell without setting the
     *        dirty flag to true by using the [[fixval]] function.
     */
    private dirty: boolean = false;

    /**
     * Contains the list of callbacks that will be run if the value of this
     * cell is changed
     */
    private changeCallbacks: Array<[cell_change_callback, any]> = [];

    /**
     * A callback that throws an exception if the value passed to it is not not
     * valid for this cell.
     */
    private test: (v: any) => void;

    /**
     * Creates an instance of [[Cell]].
     */
    constructor(test: (v: any) => void) {
        this.test = test;
    }

    /**
     * Returns true if the value of the cell has been changed since the last
     * write event and false otherwise
     */
    public get isDirty(): boolean {
        return this.dirty;
    }

    /**
     * Sets the [[isDirty]] property to false.
     */
    public written() {
        this.dirty = false;
    }

    /**
     * Returns the value stored in this cell.
     */
    public get value(): any {
        return this.val;
    }

    /**
     * Sets the value of this cell and sets the [[isDirty]] flag to true.
     *
     */
    public set value(v: any) {
        if (v !== this.value) {
            this.test(v);
            this.dirty = true;
            const oldvalue = this.val;
            this.val = v;
            this._run_callbacks(oldvalue);
        }
    }

    /**
     * Will set the value of the cell without setting the dirty flag to true.
     * This is useful for initialising the cell or if the change does not need
     * to be written.
     */
    public fix_value(v: any): void {
        if (v !== this.val) {
            this.test(v);
            const oldvalue = this.val;
            this.val = v;
            this._run_callbacks(oldvalue);
        }
    }

    /**
     * This function adds the given callback to the list of callbacks that are
     * run when this cell's value is changed. It returns the _remove_callback
     * function to remove the given callback if it is not needed anymore
     */
    public register_change(callback: cell_change_callback, context?: any): () => void {
        this.changeCallbacks.push([callback, context]);
        return this._remove_callback(callback);
    }

    /**
     * Return is a function that can be called to remove the given callback
     * from the list of change callbacks
     *
     * @Note    This function does not actually remove any callbacks itself. It
     *          only returns a function that when called will remove the
     *          callback
     */
    private _remove_callback(callback: cell_change_callback): () => void {
        return (() => {
            for (let index = 0; index < this.changeCallbacks.length; index++) {
                const element = this.changeCallbacks[index];
                if (element[0] === callback) {
                    this.changeCallbacks.splice(index, 1);
                    break;
                }
            }
        });
    }

    /**
     * Runs all the callbacks in the [[changeCallbacks]] list
     */
    private _run_callbacks(oldvalue: any): void {
        this.changeCallbacks.forEach((element) => {
            const callback = element[0];
            callback.call(element[1], this.val, oldvalue);
        });
    }
}
