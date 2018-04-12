const resolve = require('./config/webpack.config.js').resolve;
module.exports = {
  settings: {
    'import/resolver': {
      'eslint-import-resolver-webpack-alias': { resolve }
    }
  }
};
