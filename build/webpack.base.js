const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    mode: "development",
    target: "node",
    context: path.resolve(__dirname, resolve('src')),
    entry: "./main.js",
    // watch: true,
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "index.js"
    },
    devtool:'source-map',
    externals: [nodeExternals()],
    // plugins: [
    //     new NodemonPlugin({
    //         watch: path.resolve('./dist')
    //     })
    // ],
}