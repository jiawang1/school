const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, '../src');
module.exports = {
  devtool: false,
  context: contextPath, // eslint-disable-line
  entry: {
    main: ['./index']
  },
  output: {},
  resolve: {
    // mainFields: ['browser', 'main', 'module'],
    // extensions: ['.js', '.json', '.jsx']
    alias: {
      ...['components', 'resolver', 'services', 'common', 'routes'].reduce((obj, key) => {
        // eslint-disable-next-line
        obj[key] = `${contextPath}/${key}`;
        return obj;
      }, {})
    }
  },
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
};
