var Vertex = require("../../lib/index").Vertex
var Edge = require("../../lib/index").Edge
var Graph = require("../../lib/index").Graph

function TreeNode(id, parentID) {
    Vertex.call(this, id, "tree");
    this.parentID = parentID;
}

// Set up inheritence from the Vertex class
TreeNode.prototype = Object.create(Vertex.prototype);
TreeNode.prototype.constructor = TreeNode;

/**
 * This edge defines a parent node. Since there can only be one parent node
 * in a tree we specify false for the multiple argument which defaults to
 * true
 */
TreeNode.parent = new Edge(
    (from, to) => to.id === from.parentID && to.type === "tree",
    false,
);

/**
 * This edge actually defines multiple edges, one for each child of this
 * node.
 */
TreeNode.children = new Edge(
    (from, to) => from.id === to.parentID && to.type === "tree",
);

/**
 * Moves this mode to a different branch (parent) of the tree or sets it as
 * the root if parent is given as null
 */
TreeNode.prototype.move_to = function (parent) {
    this.parentID = parent ? parent.id : null;
}

/**
 * Recursively looks through the child for the given id. If no id matches
 * then it returns undefined
 */
TreeNode.prototype.find = function (id) {
    var result;
    if (this.id === id) {
        result = this;
    } else {
        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            result = child.find(id);
            if (result) {
                break;
            }
        }
    }
    return result;
}


// create a graph and add some vertices to it
var graph = new Graph();
var root = new TreeNode(0, null);
var node1 = new TreeNode(1, 0);
var node2 = new TreeNode(2, 0);
var node3 = new TreeNode(3, 1);
var node4 = new TreeNode(4, 2);
graph.add_vertex(root, node1, node2, node3, node4);

// The graph populates the edges automatically.
console.log(node1.parent); // root    Notice that this returns a single vertex
console.log(root.children); // [node1, node2]    Notice that this returns an Array

// We can search through the tree
console.log(root.find(4) === node4); // true
console.log(node2.find(4) === node4); // true
console.log(node1.find(4)); // undefined since node4 is not in this branch

// And we can move the nodes around
node4.move_to(node1);
console.log(root.find(4) === node4); // true
console.log(node2.find(4)); //undefined
console.log(node1.find(4) === node4); // true    the node was moved
