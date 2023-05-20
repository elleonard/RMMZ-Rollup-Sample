const codePath = path.resolve(__dirname, '..', '..', 'src', 'codes').replaceAll('\\', '/');
const targets = await glob([`${codePath}/`]);

/**
 * ひとまず、全ビルドはcodesのみ対象とする
 */
await Promise.all([...new Set(targets
  .filter(path => /src\/codes\/.+\/config\.yml$/.test(path))
  .map(path => /src\/codes\/(.+)\/config\.yml$/.exec(path)[1]))]
  .map(target => $`yarn zx ./scripts/buildDispatcher/build.mjs --target ${target} --noFinalize`));
