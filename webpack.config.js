const path = require('path');
const webpack = require("webpack");

module.exports = {
    entry: {
        "bcache": "./src/index.ts",
        "bcache.min": "./src/index.ts"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: 'bcache',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            include: /\.min\.js$/,
        })
    ],
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    compilerOptions: { "declaration": false }
                }
            }
        ]
    },
};