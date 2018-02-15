const path = require('path');
var webpack = require('webpack');

if (yargs.argv.p) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
    outputFile = 'bdb' + '.min.js';
} else {
    outputFile = 'bdb' + '.js';
}

module.exports = {
    entry: './src/row.ts',
    output: {
        filename: outputFile,
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
    plugins: plugins
};