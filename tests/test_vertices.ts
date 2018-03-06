import { assert, expect } from "chai";
import "mocha";
import { Vertex } from "../src/vertices";

describe("Vertex", () => {
    describe("new Vertex()", () => {
        it("Should populate the id attribute from the arguments", () => {
            const vertex = new Vertex(12);
            expect(vertex.id).to.equal(12);
        });
        it("Should allow id to be string", () => {
            const vertex = new Vertex("12");
            expect(vertex.id).to.equal("12");
        });
        it("Should allow id to be a number", () => {
            const vertex = new Vertex(12);
            expect(vertex.id).to.equal(12);
        });
        it("Should not allow id to be anything except a number or string", () => {
            const testfunction = () => {const vertex = new Vertex(true as any); };
            expect(testfunction).to.throw(TypeError, "'id' must be a string or number");
        });
        it("Should set type property from the argument", () => {
            const vertex = new Vertex(1, "TestVertex");
            expect(vertex.type).to.equal("TestVertex");
        });
        it("Should set type property to undefined by default", () => {
            const vertex = new Vertex(1);
            expect(vertex.type).to.equal(undefined);
        });
        it("Should not allow type to be anything except string or undefined", () => {
            const testfunction = () => { const vertex = new Vertex(1, true as any); };
            expect(testfunction).to.throw(TypeError, "'type' must be a string");
        });
        it("Should empty string shoudl work for type", () => {
            const vertex = new Vertex(1, "");
            expect(vertex.type).to.equal("");
        });
    });
});
