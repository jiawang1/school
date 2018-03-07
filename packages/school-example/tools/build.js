'use strict';

/* eslint-disable */
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../webpack.dist.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('../base.config');
const distFolder = path.join(__dirname, '../', baseConfig.distRelativePath);
const dllFolder = path.join(__dirname, '../', baseConfig.dllRootFolder, 'dist');
const projectName = require(path.join(__dirname, '../', 'package.json')).name;
const buildFolder = path.join(distFolder, projectName);

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
/* eslint-enable */

const DLL_VAR_NAME = 'DLL';
const params = process.argv.slice(2);
const showAnalyze = params.indexOf('--analyze') >= 0;
const contextRoot =
  params.indexOf('--contextRoot') >= 0
    ? params[params.indexOf('--contextRoot') + 1]
    : baseConfig.defaultContext;

// Clean folder
console.log('start to build front end resources');
shell.rm('-rf', buildFolder);
shell.mkdir(buildFolder);
shell.mkdir(`${buildFolder}/static`);
console.log(`clear dist folder ${buildFolder}`);

const buildApp = () => {
  let manifestFile = null;
  let dllName = null;
  try {
    manifestFile = require(path.join(dllFolder, baseConfig.manifestName));
    [dllName] = fs
      .readdirSync(dllFolder)
      .filter(file => file !== baseConfig.manifestName && !file.startsWith('.'));
    console.log(`found manifest file ${path.join(dllFolder, baseConfig.manifestName)}`);
    console.log(`found DLL file ${dllName}`);
  } catch (err) {
    console.error('manifest or DLL file not found , build process stopped');
    console.error(err);
    throw err;
  }
  config.output = {
    path: path.join(buildFolder, './static'),
    filename: `[name].bundle.[hash:8].js`,
    publicPath: `${contextRoot}/static/`,
    chunkFilename: '[name].chunk.[chunkhash:8].js'
  };
  if (showAnalyze) {
    config.plugins.push(new BundleAnalyzerPlugin({ generateStatsFile: true }));
  }
  config.plugins.push(
    new webpack.DllReferencePlugin({
      //  include dll
      manifest: manifestFile,
      context: path.join(__dirname, '../..'),
      name: DLL_VAR_NAME
    })
  );
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
      console.log('Done, build time: ', (new Date().getTime() - start) / 1000, 's');
    }
  });
};

buildApp();
