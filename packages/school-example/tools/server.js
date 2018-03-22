'use strict';

const path = require('path');
const fs = require('fs');
const util = require('util');
const shell = require('shelljs');
const webpack = require('webpack');
const exec = util.promisify(require('child_process').exec);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const devConfig = require('../config/webpack.dev.config');
const baseConfig = require('../config/base.config.js');

const buildDLL = 'npm run dev';
const dllRelativePath = `${baseConfig.dllRootFolder}/dev`;
const dllFolder = path.join(__dirname, '../', dllRelativePath);
const folderTmp = './src/_tmp/';
/* eslint-disable no-console */
function startDevServer() {
  // if DDL not exist, will throw error and trigger rebuild DLL

  let manifest;
  let dllName;
  try {
    // eslint-disable-next-line
    manifest = require(path.join(dllFolder, baseConfig.manifestName));
    [dllName] = fs.readdirSync(dllFolder).filter(file => file !== baseConfig.manifestName);
    shell.rm('-rf', folderTmp);
    shell.mkdir(folderTmp);
    shell.cp(`${dllFolder}/${dllName}`, folderTmp);
  } catch (err) {
    console.error();
    throw err;
  }
  devConfig.entry = {
    main: [
      'react-hot-loader/patch',
      `webpack-dev-server/client?http://localhost:${baseConfig.webpackDevServerPort}`,
      'webpack/hot/only-dev-server',
      './index'
    ]
  };
  devConfig.plugins.push(
    new webpack.DllReferencePlugin({
      // include dll
      manifest
    })
  );

  let aPublicpath;
  devConfig.plugins.push(
    new HtmlWebpackPlugin({
      // generate HTML
      fileName: 'index.html',
      template: 'index.ejs',
      inject: true,
      dllName: path.join('/_tmp', dllName),
      publicContext: (aPublicpath = devConfig.output.publicPath.match(/^(\/[^/]*)\/.*/)
        ? aPublicpath[1]
        : '')
    })
  );

  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    // chunkFilename: devConfig.output.chunkFilename,
    hot: true,
    noInfo: false,
    index: 'index.html',
    https: true,
    historyApiFallback: true,
    ...devConfig.devServer
  }).listen(baseConfig.webpackDevServerPort, err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Listening at localhost:${baseConfig.webpackDevServerPort}`);
    }
  });
}

try {
  startDevServer();
} catch (err) {
  console.log('manifest or DLL file not found , start to build DLL');
  exec(buildDLL, { cwd: path.join(__dirname, `../../${baseConfig.DLLProjectName}`) })
    .then(startDevServer)
    .catch(error => console.error(error));
}
