import path from 'path';
import glob from 'glob';
import applyTemplate from './extensions/rollup/rollup-apply-template.js';
import authorName from './scripts/authorName.js';
import { fileURLToPath } from 'url';
import { argv } from 'process';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const targetJsList = (() => {
  const targetFile = (() => {
    const plugin = (() => {
      const index = argv.findIndex(n => n === '--target');
      return index >= 0 ? argv[index+1] : '';
    })();
    const dir = 'codes';
    return plugin ? glob.sync(path.join(dirname, 'src', dir, `${plugin}`, `${authorName()}*.js`)) : null;
  })();
  return targetFile
    ? [targetFile].flat()
    : glob.sync(path.join(dirname, 'src', 'codes', '*', `${authorName()}*.js`));
})();

const config = targetJsList.map((input) => {
  const name = path.basename(input, '.js');
  const dir = path.dirname(input).split('/').slice(-2)[0];
  return {
    input,
    output: {
      file: `_dist/${dir}/${name}.js`,
      format: 'iife',
    },
    plugins: [
      applyTemplate({
        template: path.resolve(dirname, 'src', 'templates', 'plugin.ejs'),
      }),
    ],
    external: ['fs'],
  };
});

export default config;
