const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    new MiniCssExtractPlugin({
      filename: '[name].style.[contenthash:8].css',
      chunkFilename: '[name].chunk.[contenthash:8].css'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      ENV: '"production"',
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
});
