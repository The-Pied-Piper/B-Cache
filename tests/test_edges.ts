import { expect } from "chai";
import "mocha";
import { Edge } from "../src/edges";

describe("Edge", () => {
    describe("new Edge()", () => {
        it("Should set the rule property from the argument", () => {
            const testFn = () => true;
            const edge = new Edge(testFn, true);
            expect(edge.rule).to.equal(testFn);
        });
        it("Should set the multiple property from the argument", () => {
            const testFn = () => true;
            const edge = new Edge(testFn, false);
            expect(edge.multiple).to.equal(false);
        });
        it("Should set the multiple property to true by default", () => {
            const testFn = () => true;
            const edge = new Edge(testFn);
            expect(edge.multiple).to.equal(true);
        });
        it("Should throw an exception if the 2nd argument is not a function", () => {
            const testArg = { v1: "1", v2: "2" } as any;
            const testFn = () => { const edge = new Edge(testArg, 12 as any); };
            expect(testFn).to.throw(TypeError, "Argument 'multiple' must be boolean");
        });
        it("Should throw an exception if the 1st argument is not a function", () => {
            const testArg = { v1: "1", v2: "2" } as any;
            const testFn = () => { const edge = new Edge(testArg, true); };
            expect(testFn).to.throw(TypeError, "Argument 'rule' must be a function");
        });
    });
});
