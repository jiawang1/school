'use strict';

const path = require('path');
const shell = require('shelljs');
const babel = require('babel-core');

const babelOptions = {
  presets: ['es2015', 'react', 'babel-preset-stage-2']
};
module.exports = {
  readTemplate(name) {
    return shell.cat(path.join(__dirname, 'feature_template', name)).replace(/\r/g, '');
  },

  getLines(filePath) {
    return shell
      .cat(filePath)
      .split('\n')
      .map(line => line.replace(/\r/g, ''));
  },

  removeLines(lines, str) {
    // eslint-disable-next-line
    lines = lines.filter(line => !line.includes(str));
  },

  removeAstBlockNode(lines, node) {
    const { loc } = node;
    let start = loc.start.line - 1;
    let len = loc.end.line - loc.start.line + 1;
    if (!lines[start - 1]) {
      // remove the empty line before the function
      start -= 1;
      len += 1;
    }
    lines.splice(start, len);
  },

  removeExportFunction(lines, funcName) {
    const code = lines.join('\n');
    const ast = babel.transform(code, babelOptions).ast.program;
    const funcElement = Array.from(ast.body).find(
      _body => _body.type === 'FunctionDeclaration' && _body.id.name === funcName
    );
    //  _.find(ast.body, { type: 'FunctionDeclaration', id: { name: funcName } });
    if (funcElement) {
      this.removeAstBlockNode(lines, funcElement);
    }
  },

  lineIndex(lines, str, fromIndex = 0) {
    // return _.findIndex(lines, l => l.indexOf(str) >= 0, fromIndex || 0);
    const __index = lines.slice(fromIndex).findIndex(l => {
      if (typeof str === 'string') {
        return l.indexOf(str) >= 0;
      }
      return str.test(l);
    });
    return __index >= 0 ? fromIndex + __index : fromIndex;
  },

  // lastLineIndex(lines, str) {
  //   if (typeof str === 'string') {
  //     return _.findLastIndex(lines, l => l.indexOf(str) >= 0);
  //   }
  //   return _.findLastIndex(lines, l => str.test(l));
  // },

  // processTemplate(tpl, data) {
  //   const compiled = _.template(tpl);
  //   return compiled(data);
  // },

  getToSave(filesToSave) {
    return function toSave(filePath, fileContent) {
      filesToSave.push({
        path: filePath,
        content: Array.isArray(fileContent) ? fileContent.join('\n') : fileContent
      });
    };
  },

  saveFiles(files) {
    console.log('Save files');
    files.forEach(file => {
      shell.ShellString(file.content).to(file.path);
    });
  }
};
