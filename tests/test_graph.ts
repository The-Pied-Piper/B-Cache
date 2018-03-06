import { assert, expect } from "chai";
import "mocha";
import { Edge } from "../src/edges";
import { Graph } from "../src/graphs";
import { Vertex } from "../src/vertices";

/* tslint:disable:max-classes-per-file */

describe("Graph", () => {

    // Test the add_vertex function
    describe("add_vertex()", () => {
        it("Should work with an empty graph", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test");
            graph.add_vertex(vertex1);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex1);
        });
        it("Should work with a non-empty graph", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex2);
        });
        it("Should work with vertices of undefined type", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12);
            graph.add_vertex(vertex1);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex1);
        });
        it("Should work with vertices of same id but different type", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(12, "test2");
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex2);
        });
        it("Should differenciate between type='' and undefined", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "");
            const vertex2 = new Vertex(12, undefined);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex2);
        });
        it("Should work with vertices of same type but different id", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(13, "test1");
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            const vertices: Vertex[] = [];
            for (const key in graph.vertexIndex) {
                if (graph.vertexIndex.hasOwnProperty(key)) {
                    const element = graph.vertexIndex[key];
                    vertices.push(element);
                }
            }
            expect(vertices).to.contain(vertex2);
        });
        it("Should fail if a vertex of that type and id already exists", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(12, "test");
            graph.add_vertex(vertex1);
            const test = () => { graph.add_vertex(vertex2); };
            expect(test).to.throw(
                Error,
                "A vertex with id '12' and type 'test' already exists in the graph",
            );
        });
        it("Should fail if the argument is not a vertex", () => {
            const graph = new Graph();
            const vertex1 = { id: 1, type: "mytype" } as any;
            const test = () => { graph.add_vertex(vertex1); };
            expect(test).to.throw(
                Error,
                "Arguments must be vertices",
            );
        });
        it("Should add the edge", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => true);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(12, "test");
            graph.add_vertex(vertex1);
            expect(vertex1.hasOwnProperty("ed1")).to.equal(true);
        });
        it("Should add multiple vertices at once", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => true);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const vertex2 = new DummyVertex(13, "test");
            const vertex3 = new DummyVertex(14, "test");
            graph.add_vertex(vertex1, vertex2, vertex3);
            expect(graph.vertices).to.eql([vertex1, vertex2, vertex3]);
        });
        it("Should throw an error if any of the arguments is not a vertex", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => true);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(12, "test");
            const vertex2 = { id: 13, type: "test" } as any;
            const vertex3 = new DummyVertex(14, "test");
            const test = () => { graph.add_vertex(vertex1, vertex2, vertex3); };
            expect(test).to.throw(
                Error,
                "Arguments must be vertices",
            );
        });
        it("Should throw an error if any of the arguments have a match in the graph", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => { throw new Error("here"); });
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(12, "test");
            const vertex2 = new DummyVertex(12, "test");
            const vertex3 = new DummyVertex(14, "test");
            graph.add_vertex(vertex1);
            const test = () => { graph.add_vertex(vertex2, vertex3); };
            expect(test).to.throw(
                Error,
                "A vertex with id '12' and type 'test' already exists in the graph",
            );
        });
        it("Should throw an error if any of the arguments match each other", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => { throw new Error("here"); });
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(12, "test");
            const vertex2 = new DummyVertex(12, "test");
            const vertex3 = new DummyVertex(14, "test");
            const test = () => { graph.add_vertex(vertex1, vertex3, vertex2); };
            expect(test).to.throw(
                Error,
                "Arguments have duplicate type and id",
            );
        });
        it("Should add vertex to edges", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(2, "test");
            const vertex2 = new DummyVertex(1, "test");
            const vertex3 = new DummyVertex(6, "test");
            graph.add_vertex(vertex1, vertex2);
            graph.add_vertex(vertex3);
            expect(vertex1.ed1).to.eql([vertex3]);
            expect(vertex2.ed1).to.eql([vertex3]);
        });
        it("Should not add vertex to edges where it does not belong", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(2, "test");
            const vertex2 = new DummyVertex(1, "test");
            const vertex3 = new DummyVertex(3, "test");
            graph.add_vertex(vertex1, vertex2);
            graph.add_vertex(vertex3);
            expect(vertex1.ed1).to.eql([]);
            expect(vertex2.ed1).to.eql([]);
        });
        it("Should populate new vertexes edges", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(7, "test");
            const vertex2 = new DummyVertex(1, "test");
            const vertex3 = new DummyVertex(3, "test");
            graph.add_vertex(vertex1, vertex2);
            graph.add_vertex(vertex3);
            expect(vertex3.ed1).to.eql([vertex1]);
        });
        it("Should add vertex to edges during batch additions", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(1, "test");
            const vertex2 = new DummyVertex(2, "test");
            const vertex3 = new DummyVertex(3, "test");
            const vertex4 = new DummyVertex(6, "test");
            const vertex5 = new DummyVertex(5, "test");
            graph.add_vertex(vertex1, vertex2);
            graph.add_vertex(vertex3, vertex4, vertex5);
            expect(vertex1.ed1).to.eql([vertex4]);
            expect(vertex2.ed1).to.eql([vertex4]);
            expect(vertex3.ed1).to.eql([vertex4]);
            expect(vertex5.ed1).to.eql([vertex4]);
        });
    });

    // Test the get_vertex function
    describe("get_vertex()", () => {
        it("Should return the vertex matching the arguments", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(12, "test2");
            const vertex3 = new Vertex(13, "test1");
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.get_vertex({ id: 12, type: "test2" })).to.equal(vertex2);
        });
        it("Should work with vertices of undefined type", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.get_vertex({ id: 13, type: undefined })).to.equal(vertex3);
        });
        it("Should set type to undefined by default", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.get_vertex({ id: 13 })).to.equal(vertex3);
        });
        it("Should return undefined if no matching ids exist", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.get_vertex({ id: 15 })).to.equal(undefined);
        });
        it("Should return undefined if no matching types exist", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.get_vertex({ id: 12, type: "test3" })).to.equal(undefined);
        });
    });

    // Test the vertices property
    describe("vertices", () => {
        it("Should return an array of vertices in the graph", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.add_vertex(vertex1);
            graph.add_vertex(vertex2);
            graph.add_vertex(vertex3);
            expect(graph.vertices).to.eql([vertex1, vertex2, vertex3]);
        });
        it("Should return an empty array when the graph is empty", () => {
            const graph = new Graph() as any;
            expect(graph.vertices).to.eql([]);
        });
    });

    // Test the set_edges function
    describe("set_edge()", () => {
        it("Should add the defined edge to the vertex", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => true);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            graph.set_edges(vertex1);
            expect(vertex1.hasOwnProperty("ed1")).to.equal(true);
        });
        it("Should add the defined edges to the vertex when more than one is defined", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => true);
                public static ed2 = new Edge(() => true);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            graph.set_edges(vertex1);
            expect(vertex1.hasOwnProperty("ed1")).to.equal(true);
            expect(vertex1.hasOwnProperty("ed2")).to.equal(true);
        });
        it("Should do nothing if no edges are defined", () => {
            class DummyVertex extends Vertex {
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            const oldKeys = Object.keys(vertex1);
            graph.set_edges(vertex1);
            const newKeys = Object.keys(vertex1);
            expect(oldKeys).to.eql(newKeys);
        });
    });

    // Test the relationship function
    describe("relationship()", () => {
        it("Should return an object with the getter as a property", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => { throw new Error("here"); });
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            const rel = graph.relationship(DummyVertex.ed1, vertex1);
            expect(rel.get).to.throw(Error, "here");
        });
        it("Should make getter return an array if multiple is true", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => true, true);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12);
            const vertex2 = new DummyVertex(13);
            const index1 = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index1] = vertex1;
            const index2 = graph.get_storage_index(vertex2.id, vertex2.type);
            graph.vertexIndex[index2] = vertex2;
            const rel = graph.relationship(DummyVertex.ed1, vertex1);
            expect(rel.get()).to.eql([vertex1, vertex2]);
        });
        it("Should make getter return a single vertex if multiple is false", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((v1, v2) => v1 !== v2, false);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12);
            const vertex2 = new DummyVertex(13);
            const index1 = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index1] = vertex1;
            const index2 = graph.get_storage_index(vertex2.id, vertex2.type);
            graph.vertexIndex[index2] = vertex2;
            const rel = graph.relationship(DummyVertex.ed1, vertex1);
            expect(rel.get()).to.eql(vertex2);
        });
        it("Should make getter return null if multiple is false and nothing matches", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((v1, v2) => false, false);
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12);
            const vertex2 = new DummyVertex(13);
            const index1 = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index1] = vertex1;
            const index2 = graph.get_storage_index(vertex2.id, vertex2.type);
            graph.vertexIndex[index2] = vertex2;
            const rel = graph.relationship(DummyVertex.ed1, vertex1);
            expect(rel.get()).to.eql(null);
        });
    });

    // Test the del_vertex function
    describe("del_vertex()", () => {
        it("Should throw a not found error for an empty graph", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const testFn = () => { graph.del_vertex(vertex1); };
            expect(testFn).to.throw(Error, "Vertex not found in graph");
        });
        it("Should throw a not found error if the vertex was not found", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            graph.add_vertex(vertex1);
            const testFn = () => { graph.del_vertex(vertex2); };
            expect(testFn).to.throw(Error, "Vertex not found in graph");
        });
        it("Should throw an error if the vertex was found but the instance was wrong", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            const vertex3 = new Vertex(13, "test");
            graph.add_vertex(vertex1, vertex2);
            const testFn = () => { graph.del_vertex(vertex3); };
            expect(testFn).to.throw(Error, "Vertex found but instance in graph does not match argument");
        });
        it("Should throw an error if 2 of the arguments have the same id and type", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            graph.add_vertex(vertex1, vertex2);
            const testFn = () => { graph.del_vertex(vertex1, vertex2, vertex2); };
            expect(testFn).to.throw(Error, "Arguments have duplicate type and id");
        });
        it("Should throw an error if one of the arguments is not a vertex", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = { id: 13, type: "test" } as any;
            graph.add_vertex(vertex1);
            const testFn = () => { graph.del_vertex(vertex1, vertex2); };
            expect(testFn).to.throw(Error, "Arguments must be vertices");
        });
        it("Should work with only one argument", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            graph.add_vertex(vertex1, vertex2);
            graph.del_vertex(vertex1);
            expect(graph.get_vertex({ id: 12, type: "test" })).to.equal(undefined);
        });
        it("Should work with multiple argumets", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test");
            const vertex2 = new Vertex(13, "test");
            const vertex3 = new Vertex(14, "test");
            graph.add_vertex(vertex1, vertex2, vertex3);
            graph.del_vertex(vertex1, vertex3);
            expect(graph.get_vertex({ id: 12, type: "test" })).to.equal(undefined);
            expect(graph.get_vertex({ id: 14, type: "test" })).to.equal(undefined);
        });
        it("Should remove the vertex from edges when it is removed", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(2, "test");
            const vertex2 = new DummyVertex(1, "test");
            const vertex3 = new DummyVertex(6, "test");
            graph.add_vertex(vertex1, vertex2, vertex3);
            graph.del_vertex(vertex3);
            expect(vertex1.ed1).to.eql([]);
            expect(vertex2.ed1).to.eql([]);
        });
        it("Should remove bulk removed vertices from edges", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((from, to) => to.id > 5 && from !== to);
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(7, "test");
            const vertex2 = new DummyVertex(8, "test");
            const vertex3 = new DummyVertex(9, "test");
            graph.add_vertex(vertex1, vertex2, vertex3);
            graph.del_vertex(vertex3, vertex1);
            expect(vertex2.ed1).to.eql([]);
        });
    });
});
