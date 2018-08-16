const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const contextPath = path.join(__dirname, '../src');

const styleLoader = mode => [
  {
    loader: mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'
  },
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: true
    }
  }
];

const lessLoader = mode => [
  ...styleLoader(mode),
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
        use: lessLoader(this.mode)
      },
      {
        test: /\.css/,
        use: styleLoader(this.mode)
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'url-loader?limit=8192'
      }
    ]
  }
};
