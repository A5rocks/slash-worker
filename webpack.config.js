const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    output: {
        filename: 'worker.js',
        path: path.join(__dirname, 'dist'),
    },
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [new ForkTsCheckerWebpackPlugin()],
};
