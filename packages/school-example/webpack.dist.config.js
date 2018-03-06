const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // mode:'development',
  devtool: false,
  context: path.join(__dirname, 'src'), // eslint-disable-line
  entry: {
    main: ['./index']
  },
  output: {},
  resolve: {
    mainFields:['browser','main', 'module'],
    extensions: [".js", ".json", ".jsx"]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({ filename: 'styles.css' }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      ENV: '"production"',
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: loader => [require('autoprefixer')()]
              }
            },
            {
              loader: 'less-loader',
              options: {
                paths: [path.resolve(__dirname, './src/styles')]
              }
            }
          ]
        })
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=8192'
      }
    ]
  }
};
