import * as yaml from 'js-yaml';
import * as util from 'util';
import { validate } from 'jsonschema';
import { invariant } from '@gmjs/util';

export interface ParseYamlOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly jsonSchema?: any;
  readonly nestedErrors?: boolean;
}

const DEFAULT_PARSE_YAML_OPTIONS: ParseYamlOptions = {};

export function parseYaml(
  yamlContent: string,
  options?: ParseYamlOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  const finalOptions = options ?? DEFAULT_PARSE_YAML_OPTIONS;
  const { jsonSchema, nestedErrors } = finalOptions;

  const data = yaml.load(yamlContent);
  if (jsonSchema) {
    const validationResult = validate(data, jsonSchema, {
      nestedErrors,
    });
    if (!validationResult.valid) {
      console.error(
        util.inspect(validationResult.errors, { depth: undefined })
      );
      invariant(false, 'Validation error.');
    }
  }

  return data;
}
