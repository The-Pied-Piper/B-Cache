/**
 * A single node in a [[Graph]]. The typical use case is to extend this class
 * with what ever one wants to store in the graph.
 */
export class Vertex {
    [key: string]: any;

    /**
     * Holds the vertex's id
     */
    private vertexID: number|string;

    /**
     * Holds the vertexe's type
     */
    private vertexType: string|undefined;

    constructor(id: number|string, type?: string) {
        if (typeof id !== "string" && typeof id !== "number") {
            throw TypeError("'id' must be a string or number");
        }
        if (type && typeof type !== "string") {
            throw TypeError("'type' must be a string");
        }
        this.vertexID = id;
        this.vertexType = type || this.vertexType;

    }

    /**
     * Returns the id of the vertex
     */
    public get id(): number|string {
        return this.vertexID;
    }

    /**
     * Returns the type of this vertex.
     */
    public get type(): string|undefined {
        return this.vertexType;
    }

}
