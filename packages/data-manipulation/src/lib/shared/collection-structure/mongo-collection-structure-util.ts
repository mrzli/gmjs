import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeArray,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import {
  MongoAllCollectionsStructure,
  MongoCollectionStructure,
  MongoEntityStructure,
  MongoValueTypeStructureAny,
} from './mongo-collection-structure';
import {
  asChainable,
  distinctItems,
  invariant,
  objectGetEntries,
} from '@gmjs/util';
import { isMongoValueType } from '../mongo-schema-util';
import { MongoBsonType } from '@gmjs/mongo-util';

export function schemasToAllCollectionStructures(
  schemas: readonly MongoJsonSchemaTypeObject[]
): MongoAllCollectionsStructure {
  const collectionStructures = schemas.map(schemaToCollectionStructure);

  const allEmbeddedTypes: MongoEntityStructure[] = [];
  const addedEmbeddedTypeNames = new Set<string>();
  for (const collectionStructure of collectionStructures) {
    const newEmbeddedTypes = collectionStructure.embeddedTypes.filter(
      (item) => !addedEmbeddedTypeNames.has(item.name)
    );
    newEmbeddedTypes.forEach((item) => {
      addedEmbeddedTypeNames.add(item.name);
    });
    allEmbeddedTypes.push(...newEmbeddedTypes);
  }

  return {
    collectionTypes: collectionStructures.map((item) => item.collectionType),
    embeddedTypes: allEmbeddedTypes,
  };
}

export function schemaToCollectionStructure(
  schema: MongoJsonSchemaTypeObject
): MongoCollectionStructure {
  const schemaMap = new Map<string, MongoJsonSchemaTypeObject>();
  findAllSchemas(schema, schemaMap);
  schemaMap.delete(schema.title); // we don't want main schema in map of embedded entities

  return {
    collectionType: parseObject(schema),
    embeddedTypes: Array.from(schemaMap.values()).map(parseObject),
  };
}

function findAllSchemas(
  schema: MongoJsonSchemaTypeObject,
  schemaMap: Map<string, MongoJsonSchemaTypeObject>
): void {
  if (schemaMap.has(schema.title)) {
    return;
  }

  schemaMap.set(schema.title, schema);

  const properties = Object.values(schema.properties);
  for (const property of properties) {
    const type = property.bsonType;
    if (type === 'object') {
      findAllSchemas(property, schemaMap);
    } else if (type === 'array') {
      findAllSchemasArray(property, schemaMap);
    }
  }
}

function findAllSchemasArray(
  schema: MongoJsonSchemaTypeArray,
  schemaMap: Map<string, MongoJsonSchemaTypeObject>
): void {
  const items = schema.items;
  const type = items.bsonType;
  if (type === 'object') {
    findAllSchemas(items, schemaMap);
  } else if (type === 'array') {
    findAllSchemasArray(items, schemaMap);
  }
}

function parseObject(schema: MongoJsonSchemaTypeObject): MongoEntityStructure {
  const requiredSet = new Set<string>(schema.required);
  const propertyEntries = objectGetEntries(schema.properties);
  const finalValueTypes = propertyEntries.map((p) =>
    getFinalValueType(p.value)
  );
  return {
    name: schema.title,
    properties: propertyEntries.map((p) => ({
      name: p.key,
      isOptional: !requiredSet.has(p.key),
      valueType: parseValueType(p.value),
    })),
    mongoTypes: getMongoValueTypes(finalValueTypes),
    embeddedTypes: getEmbeddedValueTypes(finalValueTypes),
  };
}

function parseValueType(
  schema: MongoJsonSchemaAnyType
): MongoValueTypeStructureAny {
  const type = schema.bsonType;
  switch (type) {
    case 'object':
      return {
        bsonType: type,
        typeName: schema.title,
      };
    case 'array':
      return {
        bsonType: type,
        items: parseValueType(schema.items),
      };
    case 'string':
      return schema;
    case 'int':
    case 'long':
    case 'decimal':
      return {
        bsonType: type,
      };
    case 'bool':
    case 'objectId':
    case 'date':
      return schema;
    default:
      invariant(false, `Invalid property type: '${type}'.`);
  }
}

type FinalValueType = Exclude<MongoJsonSchemaAnyType, MongoJsonSchemaTypeArray>;

function getFinalValueType(schema: MongoJsonSchemaAnyType): FinalValueType {
  return schema.bsonType === 'array' ? getFinalValueType(schema.items) : schema;
}

function getMongoValueTypes(
  finalValueTypes: readonly FinalValueType[]
): readonly MongoBsonType[] {
  return asChainable(finalValueTypes)
    .map((v) => v.bsonType)
    .filter(isMongoValueType)
    .apply(distinctItems)
    .getValue();
}

function getEmbeddedValueTypes(
  finalValueTypes: readonly FinalValueType[]
): readonly string[] {
  return asChainable(finalValueTypes)
    .filter((v) => v.bsonType === 'object')
    .map((v) => (v as MongoJsonSchemaTypeObject).title)
    .apply(distinctItems)
    .getValue();
}
