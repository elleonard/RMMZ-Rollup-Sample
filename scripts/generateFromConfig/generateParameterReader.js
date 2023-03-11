import * as path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';
import generateParser from './generateParser.js';
import symbolType from './parameterSymbolType.js';

const prettierConfig = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.prettierrc');

export default function generateParameterReader(config) {
  const parameters = configToParameters(config, symbolType().PLUGIN_PARAMETERS);

  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'babel';

    const pluginParameterPath = '../../../common/pluginParameters';
    const code = `import { pluginParameters } from '${pluginParameterPath}';
    
    export const settings = {
      ${parameters.map((parameter) => `${parameter.name}: ${parameter.parser}`).join(',\n')}
    };
    `;

    return prettier.format(code, options);
  });
}

function configToParameters(config, symbolType) {
  return config && config.parameters
    ? config.parameters
        .filter((parameter) => !parameter.dummy)
        .map((parameter) => {
          return {
            name: parameter.param,
            parser: generateParser(config, parameter, symbolType),
          };
        })
    : [];
}
