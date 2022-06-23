import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeArray,
  MongoJsonSchemaTypeObject,
} from '@gmjs/data-manipulation';
import { AnyValue, objectGetEntries } from '@gmjs/util';
import { getAppInterfacePropertyName } from '../shared/mongo-schema-util';

const DEFAULT_OBJECT_ID = '0'.repeat(24);
const DEFAULT_DATE = '2020-01-02T00:00:00.000Z';

export function schemaToJsonData(schema: MongoJsonSchemaTypeObject): AnyValue {
  return parseObject(schema);
}

function parseAnyType(schema: MongoJsonSchemaAnyType): AnyValue {
  switch (schema.bsonType) {
    case 'string':
      return '';
    case 'int':
      return 0;
    case 'long':
      return 0;
    case 'bool':
      return false;
    case 'decimal':
      return '0';
    case 'objectId':
      return DEFAULT_OBJECT_ID;
    case 'date':
      return DEFAULT_DATE;
    case 'object':
      return parseObject(schema);
    case 'array':
      return parseArray(schema);
  }
}

function parseObject(schema: MongoJsonSchemaTypeObject): AnyValue {
  return objectGetEntries(schema.properties).reduce((acc, prop) => {
    return {
      ...acc,
      [getAppInterfacePropertyName(prop.key)]: parseAnyType(prop.value),
    };
  }, {});
}

function parseArray(schema: MongoJsonSchemaTypeArray): AnyValue {
  return [parseAnyType(schema.items)];
}
