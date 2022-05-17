import * as fs from 'fs-extra';
import * as path from 'path';
import { parseYaml } from '../shared/yaml';
import { invariant } from '@gmjs/util';

const DATA_MODEL_JSON_SCHEMA = fs.readJsonSync(
  path.join(__dirname, '../../assets/data-model-json-schema.json')
);

export function generateMongoJsonSchemas(
  dataModelYamlContent: string
): readonly any[] {
  const dataModel = parseYaml(dataModelYamlContent, {
    jsonSchema: DATA_MODEL_JSON_SCHEMA,
  });

  const collections: readonly any[] = dataModel.collections;
  return collections.map((c) => toMongoJsonSchema(c, true));
}

function toMongoJsonSchema(schema: any, isRoot: boolean): any {
  const properties: readonly any[] = schema.properties;
  const propertyNames: readonly string[] = properties.map((p) => p.name);
  const optional: readonly string[] = schema.optional ?? [];
  const mongoRequired = propertyNames.filter((p) => !optional.includes(p));
  const mongoProperties = properties.reduce(
    (acc, p) => ({ ...acc, [p.name]: toPropertySchema(p) }),
    {}
  );

  const finalMongoProperties: any = isRoot
    ? {
        _id: {
          bsonType: 'objectId',
        },
        ...mongoProperties,
      }
    : mongoProperties;

  const finalMongoRequired: readonly string[] = isRoot
    ? ['_id', ...mongoRequired]
    : mongoRequired;

  return {
    title: schema.name,
    bsonType: 'object',
    properties: finalMongoProperties,
    required: finalMongoRequired,
    additionalProperties: false,
  };
}

function toPropertySchema(schema: any): any {
  // check if array
  if (schema.itemType) {
    return {
      bsonType: 'array',
      items: toArrayItemsSchema(schema.itemType),
    };
  }

  // check if object
  if (schema.properties) {
    return toMongoJsonSchema(schema, false);
  }

  const type = schema.type;

  if (type === 'enumString') {
    return {
      bsonType: 'string',
      enum: schema.enumValues,
    };
  }

  switch (type) {
    case 'string':
      return {
        bsonType: 'string',
        pattern: schema.pattern,
      };
    case 'int':
    case 'long':
    case 'decimal':
      return {
        bsonType: type,
        ...toAnyNumberPropertyConstraints(schema),
      };
    case 'bool':
    case 'objectId':
    case 'date':
      return { bsonType: type };
    default:
      invariant(false, `Invalid property type: '${type}'.`);
  }

  return {};
}

function toArrayItemsSchema(schema: any): any {
  const type = schema.type;

  // check if object
  if (!type) {
    return toMongoJsonSchema(schema, false);
  }

  return { bsonType: type };
}

function toAnyNumberPropertyConstraints(schema: any): any {
  let constraints: any = {};

  if (schema.exclusiveMinimum !== undefined) {
    constraints = {
      ...constraints,
      minimum: schema.exclusiveMinimum,
      exclusiveMinimum: true,
    };
  } else {
    constraints = {
      ...constraints,
      minimum: schema.minimum,
    };
  }

  if (schema.exclusiveMaximum !== undefined) {
    constraints = {
      ...constraints,
      maximum: schema.exclusiveMaximum,
      exclusiveMaximum: true,
    };
  } else {
    constraints = {
      ...constraints,
      maximum: schema.maximum,
    };
  }

  return constraints;
}
