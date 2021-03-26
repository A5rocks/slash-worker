const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    plugins: [
        // <something about cloudflare workers not being a browser context>
        // https://github.com/cloudflare/cobol-worker-template/blob/master/webpack.config.js
        new CopyPlugin([
            { from: './vendored/ed25519_wasm_bg.wasm', to: './worker/module.wasm' }
        ]),
        new ForkTsCheckerWebpackPlugin()
    ],
};
