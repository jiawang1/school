'use strict';

/* eslint-disable */
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const webpack = require('webpack');
const util = require('util');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const exec = util.promisify(require('child_process').exec);

const config = require('../config/webpack.dist.config');
const baseConfig = require('../config/base.config');
const distFolder = path.join(__dirname, '../', baseConfig.distRelativePath);
const dllFolder = path.join(__dirname, '../', baseConfig.dllRootFolder, 'dist');
const projectName = require(path.join(__dirname, '../', 'package.json')).name;
const buildFolder = path.join(distFolder, projectName);

/* eslint-enable */
/* eslint-disable no-console */
const DLL_NOT_FOUND = 'DLL_NOT_FOUND';
const params = process.argv.slice(2);
const showAnalyze = params.indexOf('--analyze') >= 0;
const contextRoot =
  params.indexOf('--contextRoot') >= 0
    ? params[params.indexOf('--contextRoot') + 1]
    : baseConfig.defaultContext;
const hasDLL = params.indexOf('hasDLL') >= 0 ? params[params.indexOf('hasDLL') + 1] : true;

// Clean folder
console.log('start to build front end resources');
shell.rm('-rf', buildFolder);
shell.mkdir(buildFolder);
shell.mkdir(`${buildFolder}/static`);
console.log(`clear dist folder ${buildFolder}`);

const addDLLPlugin = () => {
  let manifestFile = null;
  let dllName = null;
  try {
    // eslint-disable-next-line
    manifestFile = require(path.join(dllFolder, baseConfig.manifestName));
    [dllName] = fs
      .readdirSync(dllFolder)
      .filter(file => file !== baseConfig.manifestName && !file.startsWith('.'));
    console.log(`found manifest file ${path.join(dllFolder, baseConfig.manifestName)}`);
    console.log(`found DLL file ${dllName}`);
  } catch (err) {
    console.error('manifest or DLL file not found , build process stopped');
    const error = new Error('manifest or DLL file not found');
    error.errorCode = DLL_NOT_FOUND;
    throw error;
  }

  config.plugins.push(
    new webpack.DllReferencePlugin({
      //  include dll
      manifest: manifestFile,
      context: path.join(__dirname, '../..')
    })
  );
  config.output = {
    path: path.join(buildFolder, './static'),
    filename: `[name].bundle.[hash:8].js`,
    publicPath: `${contextRoot}/static/`,
    chunkFilename: '[name].chunk.[chunkhash:8].js'
  };

  config.plugins.push(
    new HtmlWebpackPlugin({
      // generate HTML
      fileName: 'index.html',
      template: 'index.ejs',
      inject: true,
      dllName: config.output.publicPath + dllName,
      publicContext: contextRoot
    })
  );
};

const buildApp = () => {
  if (hasDLL) {
    addDLLPlugin();
  } else {
    console.log('build without webpack DLL');
  }
  if (showAnalyze) {
    config.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
  }

  const start = new Date().getTime();
  console.log(`start to build main resources at ${start}`);
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      if (err) {
        console.error(err);
        throw err;
      } else {
        const info = stats.toJson();
        if (stats.hasErrors()) {
          console.error(info.errors);
          throw new Error(info.errors);
        }
        if (stats.hasWarnings()) {
          console.log(info.warnings);
        }
      }
    } else {
      shell.mv(
        path.join(buildFolder, './static/index.html'),
        path.join(buildFolder, './index.html')
      );
      shell.cp('-R', `${dllFolder}/*`, `${buildFolder}/static/`);
      console.log('Done, build time: ', (new Date().getTime() - start) / 1000, 's');
    }
  });
};

try {
  buildApp();
} catch (err) {
  if (err.errorCode === DLL_NOT_FOUND && hasDLL) {
    exec('npm run dist', { cwd: path.join(__dirname, `../../${baseConfig.DLLProjectName}`) })
      .then(buildApp)
      .catch(error => console.error(error));
  } else {
    throw err;
  }
}
