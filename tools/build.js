/* eslint-disable */
const path = require('path');
const fs = require('fs');
const util = require('util');
const webpack = require('webpack');
const exec = require('child_process').exec;
const execPromise = util.promisify(exec);
const commandDiff = 'lerna updated --json';
let envirnPath = path.join(__dirname, '../packages');
let commandBuild = 'npm run dist';
/* eslint-enable */
/* eslint-disable no-console */
const params = process.argv.slice(2);
const targetProjectName = params[1];

const buildDLL = async () => {
  const dllprojectsBuildPath = path.join(envirnPath, 'school-dll');
  const { err } = await execPromise(commandBuild, { cwd: dllprojectsBuildPath });
  if (err) {
    console.error(`DLL building failed caused by:`);
    console.error(err);
    return false;
  }
  console.log(`DLL building done at ${new Date()}`);
  return true;
};

const buildProject = (f, mode = 'm') => {
  const projectsBuildPath = path.join(envirnPath, f);
  const child = exec(`${commandBuild} -- mode ${mode}`, { cwd: projectsBuildPath });

  return new Promise((res, rej) => {
    child.stdout.on('data', data => {
      console.log(`${f} : ${data}`);
    });
    child.stderr.on('data', data => {
      console.log(`${f} :  warning ${data}`);
    });
    child.on('error', error => {
      console.error(`build project ${f} failed`);
      console.error(error);
      rej(error);
    });
    child.on('exit', () => {
      res();
    });
  });
};
/**
 * this function used to build projects except project DLL
 * @param  {} files: projects folder
 */
const runBuildParall = files => {
  files.filter(f => f.indexOf('school-dll') < 0 && f.indexOf('.') !== 0).map(f => buildProject(f));
};

/**
 * this function used to build all projects managed in current repo
 * @param  boolean force: if true, will re-builde all projects, else, only build projects
 *  changed
 */
const buildProjects = async () => {
  if (targetProjectName) {
    buildProject(targetProjectName, 's');
  } else {
    const { err, stdout } = await execPromise(commandDiff);
    if (err) {
      console.error(err);
      return;
    }
    console.log('following projects will be built : ');
    const projects = JSON.parse(stdout).map(project => {
      console.log(`project ${project.name}`);

      /**
       *  some projects published to internal NPM repo, so the
       * project name start with @, but the file system does not has
       * this kind of folder, so here remove prefix
       */
      return project.name.replace(/^@[^/]+\//, '');
    });
    let files;
    if (projects.some(project => project.indexOf('school-dll') >= 0)) {
      if (!await buildDLL()) {
        return;
      }
      files = fs.readdirSync(envirnPath);
    }
    // if DLL changed, all projects should be re-build
    runBuildParall(files || projects);
  }
};

buildProjects();
