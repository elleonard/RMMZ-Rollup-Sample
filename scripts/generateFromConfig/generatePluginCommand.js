import * as path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';
import generateParser from './generateParser.js';
import symbolType from './parameterSymbolType.js';

const prettierConfig = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.prettierrc');
export default function generatePluginCommand(config) {
  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';
    const commands = configToCommands(config);
    const code = commands
      .filter((command) => command.args.length > 0)
      .map((command) => {
        return `export function parseArgs_${commandNameToSymbol(command.name)}(args) {
        return {
          ${command.args.map((arg) => `${arg.name}: ${arg.parser}`).join(',\n')}
        };
      }`;
      }).concat(commands
        .map(command => `export const command_${commandNameToSymbol(command.name)} = "${command.name}";`)
      )
      .join('\n\n');
    return prettier.format(code, options);
  });
}

function configToCommands(config) {
  return config && config.commands
    ? config.commands.map((command) => {
        return {
          name: command.command,
          args: command.args
            ? command.args.map((arg) => {
                return {
                  name: arg.arg,
                  parser: generateParser(config, arg, symbolType().ARGS),
                };
              })
            : [],
        };
      })
    : [];
}

/**
 * コマンド名をシンボルとして有効な形に変換する
 * （含まれるスペースを除去してその後の文字を大文字にする）
 * @param {string} commandName コマンド名
 * @return {string}
 */
function commandNameToSymbol(commandName) {
  return commandName.replace(/ ([a-z])/g, (m) => m.toUpperCase().trim());
}
