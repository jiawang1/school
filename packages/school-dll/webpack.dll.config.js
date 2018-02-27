module.exports = {
  entry: {
    vendors: [
      'react',
      'prop-types',
      'react-dom',
      'react-router-dom',
      'apollo-bridge-link',
      'apollo-cache-inmemory',
      'apollo-client',
      'graphql',
      'graphql-tag',
      'react-apollo',
      'whatwg-fetch'
    ]
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack', 'babel-loader?cacheDirectory=true']
      }
    ]
  }
};
