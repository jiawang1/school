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
  // resolve: {
  //   mainFields: ['browser', 'main', 'module'],
  //   extensions: ['.js', '.json', '.jsx']
  // },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader?cacheDirectory=true']
      }
    ]
  }
};
