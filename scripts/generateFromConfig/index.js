import path from 'path';
import glob from 'glob';
import chokidar from 'chokidar';

import generateFromConfig from './generateFromConfig.js';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const globPaths = [
  path.resolve(dirname, '..', '..', 'src', 'codes', '**', 'config.yml'),
  path.resolve(dirname, '..', '..', 'src', 'excludes', '**', 'config.yml'),
];
const isWatch = process.argv.some((n) => n === '-w');
const targetDir = (() => {
  const index = process.argv.findIndex((n) => n === '-f');
  const dir = 'codes';

  const pluginDir = index >= 0 ? process.argv[index + 1] : "";
  return index >= 0 ? path.resolve(dirname, '..', '..', 'src', dir, `${pluginDir}`, 'config.yml') : null;
})();

async function generate(file) {
  try {
    await generateFromConfig(file);
  } catch (e) {
    console.error(`[ERROR] ${file}`);
    console.error(e);
    console.error('');
    process.exit(1);
  }
}

(async () => {
  if (isWatch) {
    globPaths.forEach((globPath) => {
      const watcher = chokidar.watch(globPath);
      watcher.on('add', (file) => generateFromConfig(file));
      watcher.on('change', (file) => generateFromConfig(file));
    });
  } else {
    if (targetDir) {
      await generate(targetDir);
    } else {
      const list = globPaths.map((globPath) => glob.sync(globPath)).flat();
      for (let file of list) {
        await generate(file);
      }
    }
  }
})();
