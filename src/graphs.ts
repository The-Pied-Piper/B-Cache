import { Edge } from "./edges";
import { Vertex } from "./vertices";

export class Graph {

    /**
     * Holds all the vertices in the graph indexed by a json string of the form:
     * ```JSON
     * {id: 123, type: "MyVertexType"}
     * ```
     */
    private vertexIndex: { [key: string]: Vertex } = {};

    /**
     * Returns the vertex with the given id and type
     */
    public getVertex({ id, type }: { id: string | number, type?: string }): Vertex {
        const index = this.get_storage_index(id, type);
        return this.vertexIndex[index];
    }

    /**
     * Adds the given verted to the graph. If a vertex with this combination of
     * id and type already exists then it throws an error instead.
     */
    public addVertex(vertex: Vertex) {
        if (!(vertex instanceof Vertex)) {
            throw TypeError("Argument must be a vertex");
        }
        if (!this.getVertex({ id: vertex.id, type: vertex.type })) {
            const index = this.get_storage_index(vertex.id, vertex.type);
            this.vertexIndex[index] = vertex;
            this.set_edges(vertex);
        } else {
            throw new Error(
                "A vertex with that id and type already exists in the graph",
            );
        }

    }

    /**
     * Returns a flat Array of vertices in this graph.
     */
    public get vertices(): Vertex[] {
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
        const typeString = JSON.stringify({ t: type || null });
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
     * that the given vertex is connected to by the given [[Edge]] rule
     */
    private relationship(edge: Edge, currentVertex: Vertex) {
        return {
            get: (): Vertex | Vertex[] => {
                const result: Vertex[] = [];
                for (const vertex of this.vertices) {
                    if (edge.rule(currentVertex, vertex) && edge.multiple) {
                        result.push(vertex);
                    } else if (edge.rule(currentVertex, vertex)) {
                        return vertex;
                    }
                }
                return result;
            },
        };
    }

}
