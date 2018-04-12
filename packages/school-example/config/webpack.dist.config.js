const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackConfig = require('./webpack.config');

const contextPath = path.join(__dirname, '../src');
module.exports = Object.assign({}, webpackConfig, {
  mode: 'production',
  context: contextPath, // eslint-disable-line
  entry: {
    main: ['./index']
  },
  output: {},
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({ filename: '[name].style.[contenthash:8].css' }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      ENV: '"production"',
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
});
