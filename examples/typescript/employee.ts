import { Edge } from "../../lib/edges";
import { Graph } from "../../lib/graphs";
import { Vertex } from "../../lib/vertices";

class Employee extends Vertex {

    // This edge defines a coworker as someone who works in the same team
    public static coworkers = new Edge(
        (from, to) => from.team === to.team && from !== to,
    );

    /** An employee's manager is the manager of the team the employee works in
     * The false passed in the second argument tells the graph that this will
     * not return an Array of vertices but rather a single vertex.
     */
    public static manager = new Edge(
        (from, to) => from.team === to.team && to.isManager,
        false,
    );

    // Define our instance attributes
    public team: string;
    public name: string;
    public isManager: boolean;

    constructor(id: number | string, team: string, name: string, isManager: boolean) {
        super(id);
        this.team = team;
        this.name = name;
        this.isManager = isManager;
    }
}

// Create a new graph
const graph = new Graph();

// Create some instances of our Employee Vertex
const employee1 = new Employee(1, "marketing", "Akbar Koya", false);
const employee2 = new Employee(2, "marketing", "Ann Mathews", false);
const employee3 = new Employee(3, "marketing", "David Boyle", true);

// Add the Employees to the graph
graph.add_vertex(employee1, employee2, employee3);

// The graph automatically populates the edges for us.
console.log(employee1.coworkers);    // [employee2, employee3]
console.log(employee1.manager.name);    // David Boyle
console.log(graph.get_vertex({ id: 2 }).name);    // Ann Mathews
