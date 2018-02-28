# BrowserDB

[![CircleCI](https://circleci.com/gh/The-Pied-Piper/BrowserDB.svg?style=svg)](https://circleci.com/gh/The-Pied-Piper/BrowserDB)


A simple to use memory based storage for complex data types. Currently only a
graph based implementation is avalible. This works by defining vertices and
edges and adding them to an instance of a graph.

## Getting Started

To get started you can download or clone the repository from
[github](https://github.com/The-Pied-Piper/BrowserDB). You will also need
typescript in order to compile the project.

### Prerequisites

You only need typescript to get the project up and running

### Installing

The easiest and simplest way to install the app is via npm and the CL interface

```
npm install
```
This will install typescript for compiling the app as well as a few other dependencies for testing (mocha, chia, ts-node), building (webpack and ts-loader),documentation (typedoc) and linting (tslint)

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

We use the  tslint recomended style guide for coding. For more information you can visit the [tslint](https://palantir.github.io/tslint/) website. The package can
be installed using npm
```
npm install --save-dev tslint
```
you can then test that you are following the style by running
```
npm lint
```
## Deployment

This package can be used both in a browser as a umd and on Node.js. To build the package you will need a few more packages. If you installed the application as noted above then you are already all set otherwise you will additionally need to install webpack as well as the ts-loaded webpack plugin. This is easily done via npm and the CL interface.

```
npm install --save-dev webpack ts-loader
```
You can now build the package using
```
npm run build
```
This will build the package for you thought you will get an annoying error at the end mentioning that the documentation could not be generated. To fix this install typedoc
```
npm install --save-dev typedoc
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/The-Pied-Piper/BrowserDB/tags).

## Author

* **Umar Khan** a.k.a [The-Pied-Piper](https://github.com/The-Pied-Piper)

See also the list of [contributors](https://github.com/The-Pied-Piper/BrowserDB/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/The-Pied-Piper/BrowserDB/blob/master/LICENSE) file for details

## Acknowledgments

* This README.md file was generated using the template at https://gist.github.com/PurpleBooth/109311bb0361f32d87a2
