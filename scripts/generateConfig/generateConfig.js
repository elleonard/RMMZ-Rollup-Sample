import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import authorName from '../authorName.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(dirname, '..', '..', 'src', 'templates', 'config.ejs');
const tsconfigTemplatePath = path.resolve(dirname, '..', '..', 'tsconfig_template.json');

export default async function generateConfig(destDir) {
  fs.open(path.resolve(destDir, 'config.yml'), 'wx', (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('plugin already exists!');
        return;
      }
      throw err;
    }
    ejs.renderFile(
      templatePath,
      {
        pluginName: `${authorName()}_${path.basename(destDir)}`,
        license: /excludes/.test(destDir) ? 'No License' : 'MIT',
        year: new Date().getFullYear(),
      },
      {},
      (err, str) => {
        if (err) {
          throw err;
        } else {
          fs.write(fd, str, 'utf-8', (err) => {
            if (err) {
              throw err;
            } else {
              console.log(`generate config file done.: ${destDir}${path.sep}config.yml`);
            }
          });
        }
      }
    );
    const declarationFile = path.resolve(destDir, `${path.basename(destDir)}.d.ts`);
    fs.ensureFile(declarationFile, (err) => {
      if (err) console.error(`generate declaration failed.`);
      fs.appendFile(declarationFile, `/// <reference path="../../typings/rmmz.d.ts" />`);
    });
    const tsFile = path.resolve(destDir, `DarkPlasma_${path.basename(destDir)}.ts`);
    fs.ensureFile(tsFile, (err) => {
      if (err) console.error(`generate ts failed.`);
      fs.appendFile(tsFile, `/// <reference path="./${path.basename(destDir)}.d.ts" />`);
    });
    fs.copyFileSync(tsconfigTemplatePath, `${destDir}/tsconfig.json`);
  });
}
