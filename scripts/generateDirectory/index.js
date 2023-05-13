import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import generateConfig from '../generateConfig/generateConfig.js';

async function generateDirectory(destDir) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Directory created.: ${destDir}`);
    generateConfig(destDir);
  });
}

const codeType = (() => {
  switch (process.argv[3]) {
    case 'e':
      return 'excludes';
    default:
      return 'codes';
  }
})();
const dirname = path.dirname(fileURLToPath(import.meta.url));
const directoryPath = path.resolve(dirname, '..', '..', 'src', codeType, process.argv[2]);

(async () => {
  try {
    await generateDirectory(directoryPath);
  } catch (e) {
    console.error(`[ERROR] ${directoryPath}`);
    console.error(e);
    console.error('');
  }
})();
