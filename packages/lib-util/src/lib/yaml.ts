import * as yaml from 'js-yaml';
// TODO GM: remove this if util starts being recognized again
//  don't know what causes this issue, it makes no sense,
//  and previously when I had it on another project, it stopped occurring
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as util from 'util';
import { validate } from 'jsonschema';
import { AnyValue, invariant } from '@gmjs/util';
import { JsonObject } from 'type-fest';

export interface ParseYamlOptions {
  readonly jsonSchema?: JsonObject;
  readonly nestedErrors?: boolean;
}

const DEFAULT_PARSE_YAML_OPTIONS: ParseYamlOptions = {};

export function parseYaml(
  yamlContent: string,
  options?: ParseYamlOptions
): AnyValue {
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
