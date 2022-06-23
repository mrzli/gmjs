import { ImmutableMap, invariant } from '@gmjs/util';
import { SchemaToTypesInput } from './schema-to-types-input';

export type JsonSchemaVersion = '04' | '06' | '07' | '2019-09' | '2020-12';

export function schemaToTypes(input: SchemaToTypesInput): string {
  const { schema } = input;
  const schemaVersion = SCHEMA_ID_TO_VERSION_MAP.getOrThrow(schema.$schema);
  invariant(
    schemaVersion === '04',
    'Currently only supporting schema version 04.'
  );

  // parseDefinitions(schema);

  return '';
}

// function parseObject(schema: AnyValue, name: string): string {
//
// }

// function parseDefinitions(_schema: AnyValue): void {}

const SCHEMA_ID_TO_VERSION_MAP = ImmutableMap.fromTupleArray<
  string,
  JsonSchemaVersion
>([
  ['http://json-schema.org/draft-04/schema#', '04'],
  ['http://json-schema.org/draft-06/schema#', '06'],
  ['http://json-schema.org/draft-07/schema#', '07'],
  ['https://json-schema.org/draft/2019-09/schema', '2019-09'],
  ['https://json-schema.org/draft/2020-12/schema', '2020-12'],
]);
