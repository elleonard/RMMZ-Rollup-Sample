// 引数
// target: 対象となるプラグイン名
// ts: true or false
// exclude: true or false
// configOnly: true or false
// noFinalize: true or false

import authorName from '../authorName.js';
import fs from 'fs';

const target = argv.target;
const path = `./src/codes/${target}`;
const author = authorName();

await $`yarn node ./scripts/generateFromConfig -f ${target}`;
if (fs.existsSync(`${path}/${authorName()}_${target}.ts`)) {
  await $`yarn tsc --declaration --allowJs --emitDeclarationOnly ${path}/_build/${author}_${target}_commands.js`;
  if (!argv.configOnly) {
    fs.copyFileSync('./tsconfig_template.json', `${path}/tsconfig.json`);
    await $`yarn tsc -b ${path}`;
    await $`yarn prettier --write ${path}/${author}_${target}.js`
  }
}

if (!argv.configOnly) {
  await $`yarn rollup -c  --environment TARGET:${target}`;
  if (!argv.noFinalize) {
    await $`yarn build:format`;
    await $`yarn build:copy`;
  }
}
