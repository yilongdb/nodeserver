const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' )

module.exports = {
    mode:"development",
    target: "node",
    context:path.resolve(__dirname , '../src'),
    entry: "./main.js",
    watch: true,
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/node_modules/,
                use:['babel-loader']
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "index.js"
    },
    externals: [nodeExternals()],
    plugins: [
        new NodemonPlugin({
            watch: path.resolve('./dist')
        })
    ],
}