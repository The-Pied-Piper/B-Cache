# B-Cache

[![CircleCI](https://circleci.com/gh/The-Pied-Piper/B-Cache.svg?style=svg)](https://circleci.com/gh/The-Pied-Piper/B-Cache)

A simple to use memory based storage for complex data types. Currently only a graph like implementation is avalible. This works by defining vertices and edges and adding them to an instance of a graph. At its heart this is a data abstraction layer that makes it simple to hold complex data types that may or may not be related in some way.

## Installation

To install the package for use in your own project just use npm
```
npm install B-Cache
```

## Usage

Below is a simple use case writen in typescript. You can find other examples writen in both javascript and typescript in the [examples folder](https://github.com/The-Pied-Piper/B-Cache/tree/master/examples) of this repository.
```typescript

// First lets extend vertex with our own class.

class Employee extends Vertex {

    // This edge defines a coworker as someone who works in the same team
    public static coworkers = new Edge(
        (from, to) => from.team === to.team && from !== to,
    );

    /** An employee's manager is a member of the team the employee works in who
     * has the isManager designation. The false passed in the second argument
     * tells the graph that this will not return an Array of vertices but rather
     * a single vertex.
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
console.log(employee1.coworkers);    // [employee2, employee3]    Notice that this is an Array
console.log(employee1.manager.name);    // David Boyle    Notice that manager is a single edge

// We can also retrieve individual edges from the graph
console.log(graph.get_vertex({id: 2}).name)    // Ann Mathews

```
It is possible and often useful to have multiple sub-classes of Vertex and store them in the same graph. Since it is conceivable that in this case vertices might have the same id we can also specify a vertex type by passing a second string argument to the Vertex super class.
```typescript
super(id, "employee");
```
In this way we can prevent collisions between our Employee vertices and, lets say, Department vertices which we want to store in the same graph so that we can define edges between them. By specifying the type of the vertices we can now store a Department with id 1 in the same graph as an employee also with id 1 as long as their vertex type is different.

To retrieve a vertex with from the graph which has a defined type we must also pass the type to the get_vertex function
```typescript
console.log(graph.get_vertex({id: 2. type: "employee"}).name)    // Ann Mathewsh.
```

## Getting Started

To get started you can download or clone the repository from [github](https://github.com/The-Pied-Piper/B-Cache). You will also need typescript in order to compile the project.

### Prerequisites

You only need typescript to get the project up and running

### Installing

The easiest and simplest way to install the app is via npm and the CL interface. Navigte over to the project directory then call
```
npm install
```
This will install typescript for compiling the app as well as a few other dependencies for testing (mocha, chia, ts-node), building (webpack and ts-loader), documentation (typedoc) and linting (tslint)

## Running the tests

To run the tests will additionally require [mocha](https://mochajs.org/) and
[chai](http://chaijs.com/) and their typing information as well as ts-node. If you
installed the app as noted above then you are already all set otherwise these
can be installed via the CL

```
npm install --save-dev mocha chai ts-node @types/chai @types/mocha
```

You can now run the tests!
```
npm run test
```
Once the tests run you will get an annoying error about missing tslint. we use this to test compliance with the style guide. to fix the message read on.

### Coding style tests

We use the  tslint recomended style guide for coding. For more information you can visit the [tslint](https://palantir.github.io/tslint/) website. The package can be installed using npm
```
npm install --save-dev tslint
```
you can then test that you are following the style by running
```
npm lint
```

## Deployment

This package can be used both in a browser and on Node.js. To build the package you will need a few more packages. If you installed the application as noted above then you are already all set otherwise you will additionally need to install webpack as well as the ts-loaded webpack plugin. This is easily done via npm and the CL interface.
```
npm install --save-dev webpack ts-loader
```
You can now build the package using
```
npm run build
```
This will build the package for you, though, you will get an annoying error at the end mentioning that the documentation could not be generated. To fix this install typedoc
```
npm install --save-dev typedoc
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/The-Pied-Piper/B-Cache/tags).

## Author

* **Umar Khan** a.k.a [The-Pied-Piper](https://github.com/The-Pied-Piper)

See also the list of [contributors](https://github.com/The-Pied-Piper/B-Cache/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/The-Pied-Piper/B-Cache/blob/master/LICENSE) file for details

## Acknowledgments

* This README.md file was generated using the template at https://gist.github.com/PurpleBooth/109311bb0361f32d87a2
