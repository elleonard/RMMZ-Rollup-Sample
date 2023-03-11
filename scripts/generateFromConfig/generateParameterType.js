import * as path from 'path';
import * as prettier from 'prettier';
import { fileURLToPath } from 'url';
import { toJsTypeCategory, typeCategories } from "./generateParser.js";

const prettierConfig = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.prettierrc');

export default function generateParameterType(config, pluginId) {
  let result = "";
  if (config.structures) {
    result += Object.entries(config.structures).map(([name, structure]) => {
      return `export type ${structTypeName(pluginId, name)} = {
        ${structure.map(param => `${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
      }`;
    }).join('\n');
    result += '\n';
  }

  if (config.parameters && config.parameters.length > 0) {
    result += `export namespace settings {
      ${config.parameters.filter(param => !param.dummy).map(param => `const ${param.param}: ${paramToType(pluginId, param)}`).join(';\n')};
    }`;
  }
  return prettier.resolveConfig(prettierConfig).then((options) => {
    options.parser = 'typescript';

    return prettier.format(result, options);
  });
}

function structTypeName(pluginId, structName) {
  return `${pluginId}_${structName}`;
}

function paramToType(pluginId, param) {
  const typeCategory = toJsTypeCategory(param);
  switch (typeCategory) {
    case typeCategories().NUMBER:
    case typeCategories().STRING:
    case typeCategories().BOOLEAN:
      return typeCategory;
    case typeCategories().ARRAY:
      const arrayOf = {
        type: param.type.replace('[]', ''),
        options: param.options,
      };
      return `${paramToType(pluginId, arrayOf)}[]`;
    case typeCategories().STRUCT:
      return structTypeName(pluginId, param.type);
  }
  return "";
}
