/*eslint-disable*/
const path = require('path');
const shell = require('shelljs');
const webpack = require('webpack');
const crypto = require('crypto');
const dllConfig = require('../webpack.dll.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const distPath = '../../dist';
const oPackage = require(path.join(__dirname, '../', 'package.json'));
const projectName = oPackage.name;
const relativeTargetPath = path.join(__dirname, '../', distPath, projectName);
/*eslint-enable*/
const DLL_VAR_NAME = 'DLL';
const params = process.argv.slice(2);
const forceBuild = params.indexOf('--force') >= 0;
const mode = params[0].slice(2);

const generateHash = () => {
  const nameVersions = dllConfig.entry.vendors
    .map(pkgName => {
      const pkgJson = require(path.join(pkgName.split('/')[0], 'package.json'));
      return `${pkgJson.name}_${pkgJson.version}`;
    })
    .join('-');
  return crypto
    .createHash('md5')
    .update(nameVersions)
    .digest('hex');
};

const cleanUp = target => {
  shell.rm('-rf', target);
  shell.mkdir(target);
};

function buildDll(env = 'production') {
  const dllHash = generateHash();
  const dllName = `vendors_${dllHash}`;
  const dllFileName = `${dllName}.dll.js`;
  console.log('dll name: ', dllName);

  const envpath = env =='production'?'dist':'dev';
  const targetPath = path.join(relativeTargetPath, envpath);
  const manifestPath = path.join(relativeTargetPath, envpath, 'vendors-manifest.json');

  return new Promise((resolve, reject) => {
    if (
      forceBuild ||
      !shell.test('-e', manifestPath) || // dll doesn't exist
      require(manifestPath).name !== dllName // dll hash has changed
    ) {
      delete require.cache[manifestPath]; // force reload the new manifest
      cleanUp(targetPath);
      console.log('vendors have changed, rebuilding dll...');
      const startTime = Date.now();

      dllConfig.mode = env;
      dllConfig.output = {
        path: targetPath,
        filename: dllFileName,
        library: DLL_VAR_NAME // reference to current dll, should be the same with dll plugin name
      };
      const oEnvironment = {
        ENV: `"${env}"`,
        'process.env': {
          NODE_ENV: JSON.stringify(`${env}`)
        }
      };

      if (env === 'production') {
        dllConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
        dllConfig.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
      }
      dllConfig.plugins.push(new webpack.DefinePlugin(oEnvironment));
      dllConfig.plugins.push(
        new webpack.DllPlugin({
          path: manifestPath,
          name: DLL_VAR_NAME,
          context: path.join(__dirname, '../..')
        })
      );

      webpack(dllConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error('dll build failed:');
          console.error((err && err.stack) || stats.hasErrors());
          if(stats.hasErrors()){
            const info = stats.toJson();
            if (stats.hasErrors()) {
              console.error(info.errors);
              throw new Error(info.errors);
            }
            if (stats.hasWarnings()) {
              console.log(info.warnings);
            }
          }
          console.log(`DLL build exit time ${new Date().getTime()}`);
          process.exit(1);
        }
        console.log('dll build success.');
        resolve({
          dllFileName,
          targetPath
        });
        console.log(`DLL build exit, it takes ${(new Date().getTime()- startTime)/1000} S`);
        process.exit(0);
      });
    } else {
      console.log('vendors dll is up to date, no need to rebuild.');
      resolve({
        dllFileName,
        targetPath
      });
      console.log(`DLL build exit, it takes ${(new Date().getTime()- startTime)/1000} S`);
      process.exit(0);
    }
  });
}
buildDll(mode);
