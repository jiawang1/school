const DLLProjectName = 'dll';
const distRelativePath = '../../dist/';

const __exports = {
  defaultContext: '',
  troopContext: '/services/api',
  troopQueryContext: '/services/api/proxy/queryproxy',
  DLLProjectName,
  publicPath: '',
  manifestName: 'vendors-manifest.json',
  webpackDevServerPort: 8012,
  distRelativePath, // relative path from your project root to dist folder
  dllRootFolder: `${distRelativePath}@shanghai/${DLLProjectName}/`,
  allowedHosts: [],
  proxyAddress: 'www.englishtown.com' // just for wepack dev server proxy
};

/**
 *  this part can support customize local development
 * environment and do not need to worried about influence other's
 * code, base.config.dev is ignored by git
 */
if (process.env.NODE_ENV === 'development') {
  try {
    const devConfig = require('./base.config.dev');
    if (devConfig) {
      Object.assign(__exports, devConfig);
    }
  } catch (err) {
    // ignore
  }
}
module.exports = __exports;
