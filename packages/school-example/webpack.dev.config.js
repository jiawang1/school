const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const Dashboard = require('webpack-dashboard');
const baseConfig = require('./base.config');
const troopContext = require('./base.config').troopContext;

const dashboard = new Dashboard();
module.exports = {
  devtool: 'inline-source-map',
  cache: true,
  /*eslint-disable*/
  context: path.join(__dirname, 'src'),
  entry: {
    // dynamically add by server.js
  },
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: '[name].bundle.js',
    publicPath: baseConfig.publicPath,
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    sourceMapFilename: '[name].map'
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    /*eslint-enable*/
    proxy: [
      {
        context: [troopContext, '/login/secure.ashx'],
        target: 'https://localhost:8079/',
        secure: false
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({ filename: 'styles.css' }),
    new webpack.DefinePlugin({
      ENV: '"dev"'
    }),
    new DashboardPlugin(dashboard.setData)
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules|build/,
        use: ['babel-loader?cacheDirectory=true']
      },
      {
        test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: loader => [require('autoprefixer')()]
            }
          },
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.css/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { sourceMap: true } }]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=8192'
      }
    ]
  }
};