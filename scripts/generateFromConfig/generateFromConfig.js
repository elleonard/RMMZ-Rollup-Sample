import generateHeader from './generateHeader.js';
import authorName from '../authorName.js';

import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { mkdirp } from 'mkdirp';
import generateParameterReader from './generateParameterReader.js';
import generatePluginCommand from './generatePluginCommand.js';
import generateParameterType from './generateParameterType.js';

export default async function generateFromConfig(file) {
  const config = loadConfig(file);
  const distDir = path.resolve(file, '..', '_build');
  mkdirp.sync(distDir);

  const pluginName = config.name;
  fs.writeFileSync(path.resolve(distDir, `${pluginName}_header.js`), generateHeader(config));
  const parameterReader = await generateParameterReader(config);
  fs.writeFileSync(path.resolve(distDir, `${pluginName}_parameters.js`), parameterReader);
  const pluginCommands = await generatePluginCommand(config);
  fs.writeFileSync(path.resolve(distDir, `${pluginName}_commands.js`), pluginCommands);
  const parameterType = await generateParameterType(config, pluginName.replace(`${authorName()}_`, ''));
  fs.writeFileSync(path.resolve(distDir, `${pluginName}_parameters.d.ts`), parameterType);

  console.log(`build config: ${file}`);
  console.log('');
}

function loadConfig(configPath) {
  return YAML.parse(fs.readFileSync(configPath, 'UTF-8'), { merge: true });
}
