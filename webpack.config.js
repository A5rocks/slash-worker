const path = require('path')
const webpack = require('webpack')

module.exports = {
  output: {
    filename: `worker.js`,
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [],
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
}
