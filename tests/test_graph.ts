import { assert, expect } from "chai";
import "mocha";
import { Edge } from "../src/edges";
import { Graph } from "../src/graphs";
import { Vertex } from "../src/vertices";

/* tslint:disable:max-classes-per-file */

describe("Graph", () => {

    // Test the addVertex function
    describe("addVertex()", () => {
        it("Should work with an empty graph", () => {
            const graph = new Graph() as any;
            const vertex1 = new Vertex(12, "test");
            graph.addVertex(vertex1);
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
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
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
            graph.addVertex(vertex1);
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
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
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
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
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
            graph.addVertex(vertex1);
            const test = () => { graph.addVertex(vertex2); };
            expect(test).to.throw(
                Error,
                "A vertex with that id and type already exists in the graph",
            );
        });
        it("Should fail if the argument is not a vertex", () => {
            const graph = new Graph();
            const vertex1 = { id: 1, type: "mytype" } as any;
            const test = () => { graph.addVertex(vertex1); };
            expect(test).to.throw(
                Error,
                "Argument must be a vertex",
            );
        });
        it("Should add the edge", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge((vertex) => { throw new Error("here"); });
            }
            const graph = new Graph();
            const vertex1 = new DummyVertex(12, "test");
            graph.addVertex(vertex1);
            expect(() => { const relation = vertex1.ed1; }).to.throw(Error, "here");
        });
    });

    // Test the getVertex function
    describe("getVertex()", () => {
        it("Should return the vertex matching the arguments", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(12, "test2");
            const vertex3 = new Vertex(13, "test1");
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.getVertex({ id: 12, type: "test2" })).to.equal(vertex2);
        });
        it("Should work with vertices of undefined type", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.getVertex({ id: 13, type: undefined })).to.equal(vertex3);
        });
        it("Should set type to undefined by default", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.getVertex({ id: 13 })).to.equal(vertex3);
        });
        it("Should return undefined if no matching ids exist", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.getVertex({ id: 15 })).to.equal(undefined);
        });
        it("Should return undefined if no matching types exist", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.getVertex({ id: 12, type: "test3" })).to.equal(undefined);
        });
    });

    // Test the vertices property
    describe("vertices", () => {
        it("Should return an array of vertices in the graph", () => {
            const graph = new Graph();
            const vertex1 = new Vertex(12, "test1");
            const vertex2 = new Vertex(14, "test1");
            const vertex3 = new Vertex(13);
            graph.addVertex(vertex1);
            graph.addVertex(vertex2);
            graph.addVertex(vertex3);
            expect(graph.vertices).to.eql([vertex1, vertex2, vertex3]);
        });
        it("Should return an empty array when the graph is empty", () => {
            const graph = new Graph();
            expect(graph.vertices).to.eql([]);
        });
    });

    // Test the set_edgs function
    describe("set_edge()", () => {
        it("Should add the defined edge to the vertex", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => { throw new Error("here"); });
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            graph.set_edges(vertex1);
            expect(() => { const relation = vertex1.ed1; }).to.throw(Error, "here");
        });
        it("Should add the defined edges to the vertex when more than one is defined", () => {
            class DummyVertex extends Vertex {
                public static ed1 = new Edge(() => { throw new Error("here1"); });
                public static ed2 = new Edge(() => { throw new Error("here2"); });
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            graph.set_edges(vertex1);
            expect(() => { const relation = vertex1.ed1; }).to.throw(Error, "here1");
            expect(() => { const relation = vertex1.ed2; }).to.throw(Error, "here2");
        });
        it("Should do nothing if no edges are defined", () => {
            class DummyVertex extends Vertex {
            }
            const graph = new Graph() as any;
            const vertex1 = new DummyVertex(12, "test");
            const index = graph.get_storage_index(vertex1.id, vertex1.type);
            graph.vertexIndex[index] = vertex1;
            graph.set_edges(vertex1);
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
        it("Should make getter return a sigle vertex if multiple is false", () => {
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
    });
});
