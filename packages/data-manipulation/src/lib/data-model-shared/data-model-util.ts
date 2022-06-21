import { readJsonSync } from '@gmjs/fs-util';
import path from 'path';
import { parseYaml } from '@gmjs/lib-util';
import { AnyValue } from '@gmjs/util';

const DATA_MODEL_JSON_SCHEMA = readJsonSync(
  path.join(__dirname, '../assets/data-model-json-schema.json')
);

export function parseDataModelYaml(dataModelYamlContent: string): AnyValue {
  return parseYaml(dataModelYamlContent, {
    jsonSchema: DATA_MODEL_JSON_SCHEMA,
  });
}
