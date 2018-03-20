const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./base.config');
const { troopContext } = require('./base.config');
const webpackConfig = require('./webpack.config');

const contextPath = path.join(__dirname, '../src');

module.exports = Object.assign({}, webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  cache: true,
  /*eslint-disable*/
  entry: {
    // dynamically add by server.js
  },
  output: {
    path: path.join(__dirname, '../build/static'),
    filename: '[name].bundle.js',
    publicPath: baseConfig.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    sourceMapFilename: '[name].map'
  },
  devServer: {
    contentBase: contextPath,
    allowedHosts: [],
    /* eslint-enable */
    proxy: [
      {
        context: [troopContext, '/login/secure.ashx'],
        target: 'http://smartuat2.englishtown.com/',
        secure: false,
        cookieDomainRewrite: '',
        onProxyReq: function onProxyReq(proxyReq) {
          proxyReq.setHeader('Host', 'smartuat2.englishtown.com');
          proxyReq.setHeader('Referer', 'http://smartuat2.englishtown.com/');
          proxyReq.setHeader('Origin', 'http://smartuat2.englishtown.com/');
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({ filename: 'styles.css' }),
    new webpack.DefinePlugin({
      ENV: '"development"',
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]
});
