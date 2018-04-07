# school

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)


truant is a javascript framework for building scalable web applications base on React, graphql, apollo-client and some other libraries. This repository is a monorepo that managed by [Lerna](https://github.com/lerna/lerna).

### Quick Start
1. You can get source code from git or just down load code. 
2. navigate to root folder and run following command to initialize projects
````shell
 npm run init
````
3. when the installation finished, go to folder school/packages/school-example/ and startup example project
````shell
 npm start
````
4. open address http://localhost:8012/#/logon in browser, you will see the example page.

### build projects

navigate to root folder and run command
````shell
 npm run dist
````
this command will build all packages and put generated stuff in dist folder

### current packages

1. [dll](https://github.com/jiawang1/truant/blob/master/packages/truant-dll/README.md): all open source libraries shared by other packages in the repo. This package will be built as webpack DLL. 
2. [troop-adapter](https://github.com/jiawang1/truant/blob/master/packages/truant-core/README.md): provide some features to compitable with troopjs, like simple troop query without batch and cache.
3. [school-example](https://github.com/jiawang1/truant/blob/master/packages/truant-example/README.md): an example page demenstrate how to build application base on apollo-client and troop-adapter.
