import {
  AnyValue,
  invariant,
  isObject,
  isString,
  mapGetOrThrow,
  ReadonlyRecord,
} from '@gmjs/util';
import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeNumberBase,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import { Except } from 'type-fest';
import { parseDataModelYaml } from '../shared/data-model-util';

export function dataModelToSchema(
  dataModelYamlContent: string
): readonly MongoJsonSchemaTypeObject[] {
  const dataModel = parseDataModelYaml(dataModelYamlContent);

  const collections: readonly AnyValue[] = dataModel.collections;
  const objectReferences = new Map<string, MongoJsonSchemaTypeObject>();
  return collections.map((c) => toMongoJsonSchema(c, objectReferences, true));
}

function toMongoJsonSchema(
  schema: AnyValue,
  objectReferences: Map<string, MongoJsonSchemaTypeObject>,
  isRoot: boolean
): MongoJsonSchemaTypeObject {
  const properties: readonly AnyValue[] = schema.properties;
  const propertyNames: readonly string[] = properties.map((p) => p.name);
  const optional: readonly string[] | undefined = schema.optional;
  const mongoRequired = optional
    ? propertyNames.filter((p) => !optional.includes(p))
    : propertyNames;

  const mongoProperties: ReadonlyRecord<string, MongoJsonSchemaAnyType> =
    properties.reduce(
      (acc, p) => ({
        ...acc,
        [p.name]: toValueTypeSchema(p, objectReferences),
      }),
      {}
    );

  const finalMongoProperties: ReadonlyRecord<string, MongoJsonSchemaAnyType> =
    isRoot
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

function toValueTypeSchema(
  schema: AnyValue,
  objectReferences: Map<string, MongoJsonSchemaTypeObject>
): MongoJsonSchemaAnyType {
  if (schema.items) {
    // this is an array
    return {
      bsonType: 'array',
      items: toValueTypeSchema(schema.items, objectReferences),
    };
  } else if (schema.ref) {
    invariant(
      objectReferences.has(schema.ref),
      `Invalid object reference: '${schema.ref}'.`
    );
    return mapGetOrThrow(objectReferences, schema.ref);
  }

  const type = schema.type;
  invariant(
    !!type,
    "All property types except 'array' or 'ref' must have 'type' defined."
  );

  // check if object
  // (which incidentally is the only type that has an 'object' structure in yaml)
  if (isObject(type)) {
    const objDefinition = toMongoJsonSchema(type, objectReferences, false);
    invariant(
      !objectReferences.has(objDefinition.title),
      `Object with the name '${objDefinition.title}' already defined.`
    );
    objectReferences.set(objDefinition.title, objDefinition);
    return objDefinition;
  } else if (isString(type)) {
    return toSimpleTypeSchema(schema);
  }

  invariant(false, `Invalid property type: '${type}'.`);
}

function toSimpleTypeSchema(schema: AnyValue): MongoJsonSchemaAnyType {
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
    case 'double':
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

function toAnyNumberPropertyConstraints(
  schema: AnyValue
): Except<MongoJsonSchemaTypeNumberBase, 'bsonType'> {
  let constraints: Except<MongoJsonSchemaTypeNumberBase, 'bsonType'> = {};

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
