import { Edge } from "./edges";
import { Vertex } from "./vertices";

/**
 * A graph is a collection of vertices and edges (maps to other vertices). It
 * exposes 2 functions: add_vertex and get_vertex that do as their names
 * suggest, add and retrieve vertices to and from the graph respectively.
 *
 * ```typescript
 * graph = new Graph();
 * graph.add_vertex(myvertex1, myvertex2, myvertex3);  // Adds the 3 vertices to the graph
 * console.log(graph.get_vertex({id: 1, type: "testvertex"});)  // Vertex with id 1 and type "testvertex"
 * ```
 */
export class Graph {

    /**
     * Holds all the vertices in the graph indexed by a json string of the form:
     * ```JSON
     * {id: 123, type: "MyVertexType"}
     * ```
     */
    private vertexIndex: { [key: string]: Vertex } = {};

    /**
     * Returns the vertex with the given id and type. If no type is given then
     * null is assumed.
     */
    public get_vertex({ id, type }: { id: string | number, type?: string }): Vertex|undefined {
        const index = this.get_storage_index(id, type);
        return this.vertexIndex[index];
    }

    /**
     * Adds the given verted to the graph. If a vertex with this combination of
     * id and type already exists then it throws an error instead.
     */
    public add_vertex(...args: Vertex[]): void {

        // Make sure everything is a vertex
        this.check_is_vertex(args);

        // Make sure no duplicates exist in the graph
        this.check_no_graph_duplicates(args);

        // Make sure no duplicates exist in the arguments
        this.check_argument_duplicates(args);

        // add the vertices to the graph
        for (const vertex of args) {
            const index = this.get_storage_index(vertex.id, vertex.type);
            this.vertexIndex[index] = vertex;
            this.set_edges(vertex);
        }
    }

    /**
     * Removes the given vertices from the graph
     */
    public del_vertex(...args: Vertex[]): void {

        // Make sure everything is a vertex
        this.check_is_vertex(args);

        // Make sure no duplicates exist in the graph
        this.check_exist_in_graph(args);

        // Make sure no duplicates exist in the arguments
        this.check_argument_duplicates(args);

        for (const vertex of args) {
            const index: string = this.get_storage_index(vertex.id, vertex.type);
            delete this.vertexIndex[index];
        }

    }

    /**
     * Returns a flat Array of vertices in this graph.
     */
    private get vertices(): Vertex[] {
        const result: Vertex[] = [];
        for (const key in this.vertexIndex) {
            if (this.vertexIndex.hasOwnProperty(key)) {
                const element = this.vertexIndex[key];
                result.push(element);
            }
        }
        return result;
    }

    /**
     * Retruns the storage index that would refer to a vertex in [[vertexIndex]].
     * @Note: Can not stringify {id: ..., type: ...} since order is not
     *        gurenteed in this case and we need the order to be fixed to
     *        confirm uniqueness. ex: { id 1, type: null } and
     *        { type: null, id: 1 } should refer to the same object.
     */
    private get_storage_index(id: number | string, type?: string): string {
        const idString = JSON.stringify({ i: id }).replace("}", ",");
        const vertexType = type === undefined ? null : type;
        const typeString = JSON.stringify({ t: vertexType });
        const index = idString + typeString.substring(1);
        index.replace(/\s/g, "");
        return idString + typeString.substring(1);
    }

    /**
     * Helper function for [[addVerted]] used to add the edges on a vertex when
     * it is inserted into the graph.
     */
    private set_edges(vertex: Vertex) {
        for (const key in vertex.constructor) {
            if (vertex.constructor.hasOwnProperty(key)) {
                const element = (vertex.constructor as any)[key];
                if (element instanceof Edge) {
                    Object.defineProperty(
                        vertex,
                        key,
                        this.relationship(element, vertex),
                    );
                }
            }
        }
    }

    /**
     * Returns an object with a getter funciton for returning all the vertices
     * that the given vertex is connected to by the given [[Edge]] rule. If no
     * matches are found and multiple is flase the null is returned else an
     * empty array and returned
     */
    private relationship(edge: Edge, currentVertex: Vertex) {
        return {
            get: (): Vertex | Vertex[] | null => {
                const result: Vertex[] = [];
                for (const vertex of this.vertices) {
                    if (edge.rule(currentVertex, vertex) && edge.multiple) {
                        result.push(vertex);
                    } else if (edge.rule(currentVertex, vertex)) {
                        return vertex;
                    }
                }
                if (edge.multiple) {
                    return result;
                }
                return null;
            },
        };
    }

    /**
     * A helper function for argument sanitisation. This funciton makes sure
     * that all of its arguments are instances of [[Vertex]]. If one is found
     * that is not a vertex then it will throw an error.
     */
    private check_is_vertex(vertices: Vertex[]) {
        for (const vertex of vertices) {
            if (!(vertex instanceof Vertex)) {
                throw TypeError("Arguments must be vertices");
            }
        }
    }

    /**
     * A helper function for argument sanitisation. This funciton makes sure
     * that none of its arguments have the same id and type as a vertex in the
     * graph. If one is found it will throw an error.
     */
    private check_no_graph_duplicates(vertices: Vertex[]) {
        for (const vertex of vertices) {
            if (this.get_vertex({ id: vertex.id, type: vertex.type })) {
                throw new Error(
                    "A vertex with id '" + vertex.id + "' and type '" +
                    vertex.type + "' already exists in the graph",
                );
            }
        }
    }

    /**
     * A helper function for argument sanitisation. This funciton makes sure
     * that all of its arguments exist in the graph. If not then it will throw
     * an error
     */
    private check_exist_in_graph(vertices: Vertex[]) {
        for (const vertex of vertices) {
            const graphVertex = this.get_vertex({ id: vertex.id, type: vertex.type });
            if (!graphVertex) {
                throw new Error(
                    "Vertex not found in graph",
                );
            } else if (graphVertex !== vertex) {
                throw new Error(
                    "Vertex found but instance in graph does not match argument",
                );
            }
        }
    }

    /**
     * A helper function for argument sanitisation. This funciton makes sure
     * that none of its arguments have the same id and type. If one is found it
     * will throw an error.
     */
    private check_argument_duplicates(vertices: Vertex[]) {
        const argIndexes: string[] = [];
        for (const vertex of vertices) {
            const storageIndex = this.get_storage_index(vertex.id, vertex.type);
            const duplicate = argIndexes.some(
                (vindex) => storageIndex === vindex,
            );
            if (duplicate) {
                throw new Error(
                    "Arguments have duplicate type and id",
                );
            }
            argIndexes.push(storageIndex);
        }
    }

}
