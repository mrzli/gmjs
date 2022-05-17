import * as fs from 'fs-extra';
import * as path from 'path';
import { parseYaml } from '../shared/yaml';
import { invariant, isObject, isString } from '@gmjs/util';

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
  const optional: readonly string[] | undefined = schema.optional;
  const mongoRequired = optional
    ? propertyNames.filter((p) => !optional.includes(p))
    : propertyNames;

  const mongoProperties = properties.reduce(
    (acc, p) => ({ ...acc, [p.name]: toValueTypeSchema(p) }),
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

function toValueTypeSchema(schema: any): any {
  // check if array
  if (schema.items) {
    return {
      bsonType: 'array',
      items: toValueTypeSchema(schema.items),
    };
  }

  const type = schema.type;
  invariant(
    !!type,
    "All property types except 'array' must have 'type' defined."
  );

  // check if object (which incidentally has an 'object' definition in yaml)
  if (isObject(type)) {
    return toMongoJsonSchema(type, false);
  } else if (isString(type)) {
    return toSimpleTypeSchema(schema);
  }

  invariant(false, 'Invalid property type.');
}

function toSimpleTypeSchema(schema: any): any {
  const type = schema.type;
  invariant(
    isString(type),
    "Simple schema type must be represented by a javascript 'string' value."
  );

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
    case 'enumString':
      return {
        bsonType: 'string',
        enum: schema.enumValues,
      };
    default:
      invariant(false, `Invalid property type: '${type}'.`);
  }
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
