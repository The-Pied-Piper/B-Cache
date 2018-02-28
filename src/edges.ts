import { Vertex } from "./vertices";

/**
 * Describes how a vertex is related to other vertices in a graph. The rule
 * callback in the constructor's arguments takes 2 arguments 'from' (the origin
 * vertex) & 'to' (the destination vertex) and returns true if an edge edists from
 * the first to the second.
 *
 * Below is an example that creates an edge between an instance of MyVertex
 * and any other vertex in the graph (not just instance of MyVertex) that have
 * an id greater than itself.
 *
 * ```typescript
 * class MyVertex extends Vertex {
 *     public static edges = new Edge((from, to) => from.id > to);
 * }
 *
 * // Create a new graph
 * const graph = new Graph();
 *
 * // Creates some vertices to add to the graph
 * const vertex1 = new MyVertex(1);
 * const vertex2 = new SomeOtherVertex(2); // Not an instance of Myvertex
 * const vertex3 = new MyVertex(3);
 *
 * graph.addVertex(vertex1);
 * graph.addVertex(vertex2);
 * graph.addVertex(vertex3);
 * vertex1.edges // [vertex2, vertex3]
 * vertex2.edges // [vertex3]
 * vertex3.edges // []
 * ```
 */
export class Edge {

    /**
     * Holds the rule for determining edges
     */
    private edgeRule: (from: Vertex, to: Vertex) => boolean;

    /**
     * Holds whether this rule returns a single vertex or an Array of vertices
     */
    private multipledges: boolean;

    /**
     * Creates an instance of an [[Edge]]
     */
    constructor(rule: (from: Vertex, to: Vertex) => boolean, multiple: boolean = true) {
        if (typeof multiple !== "boolean") {
            throw TypeError("Argument 'multiple' must be boolean");
        }
        if (typeof rule !== "function") {
            throw TypeError("Argument 'rule' must be a function");
        }
        this.edgeRule = rule;
        this.multipledges = multiple;
    }

    /**
     * Retruns the [[edgeRule]] for this [[Edge]]
     */
    public get rule(): (from: Vertex, to: Vertex) => boolean {
        return this.edgeRule;
    }

    /**
     * Returns whether or not this Edge's rule connects to more than one vertex
     */
    public get multiple(): boolean {
        return this.multipledges;
    }
}
