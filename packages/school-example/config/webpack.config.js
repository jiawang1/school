const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, '../src');

const styleLoader = mode => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        minimize: true
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [require('autoprefixer')()]
      }
    },
    {
      loader: 'less-loader',
      options: {
        paths: [path.resolve(__dirname, '../src/styles')]
      }
    }
  ];

  if (mode === 'production') {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [...loaders]
    });
  }
  loaders.unshift({
    loader: 'style-loader'
  });
  return loaders;
};

module.exports = {
  context: contextPath,
  resolve: {
    alias: {
      ...['components', 'resolver', 'services', 'common', 'routes', 'containers'].reduce(
        (obj, key) => {
          // eslint-disable-next-line
          obj[key] = `${contextPath}/${key}`;
          return obj;
        },
        {}
      )
    }
  },
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
        use: styleLoader(this.mode)
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
