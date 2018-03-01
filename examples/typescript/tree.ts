import { Vertex } from "b-cache/lib-esm/index";
import { Edge } from "b-cache/lib-esm/index";
import { Graph } from "b-cache/lib-esm/index";

/**
 * This class defines a Tree Vertex
 */
class TreeNode extends Vertex {

    /**
     * This edge defines a parent node. Since there can only be one parent node
     * in a tree we specify false for the multiple argument which defaults to
     * true
     */
    public static parent = new Edge(
        (from, to) => to.id === from.parentID && to.type === "tree",
        false,
    );

    /**
     * This edge actually defines multiple edges, one for each child of this
     * node.
     */
    public static children = new Edge(
        (from, to) => from.id === to.parentID && to.type === "tree",
    );

    /**
     * Holds this node's parent's id or null if this is the root node.
     */
    private pID: number | string | null;

    constructor(id: number, parentID: number | string | null) {
        super(id, "tree");
        this.pID = parentID;
    }

    /**
     * Returns the id of this node's parent
     */
    public get parentID(): number | string | null {
        return this.pID;
    }

    /**
     * Moves this mode to a different branch (parent) of the tree or sets it as
     * the root if parent is given as null
     */
    public move(parent: TreeNode | null) {
        this.pID = parent ? parent.id : null;
    }

    /**
     * Recursively looks through the child for the given id. If no id matches
     * then it returns undefined
     */
    public find(id: number): TreeNode {
        let result;
        if (this.id === id) {
            result = this;
        } else {
            for (const child of this.children as TreeNode[]) {
                result = child.find(id);
                if (result) {
                    break;
                }
            }
        }
        return result;
    }
}

// create a graph and add some vertices to it
const graph = new Graph();
const root = new TreeNode(0, null);
const node1 = new TreeNode(1, 0);
const node2 = new TreeNode(2, 0);
const node3 = new TreeNode(3, 1);
const node4 = new TreeNode(4, 2);
graph.add_vertex(root, node1, node2, node3, node4);

// The graph makes the edges we need with the other vertices.
console.log(node1.parent); // root    Notice that this returns a single vertex
console.log(node1.children); // [node3]    Notice that this returns an Array
