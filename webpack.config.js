const path = require('path');

module.exports = {
    entry: './src/graphs.ts',
    output: {
        filename: 'bdb.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'bdb',
        libraryTarget: 'umd'
    },
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ }
        ]
    },
};