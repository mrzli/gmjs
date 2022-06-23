import { MongoJsonSchemaBsonType } from '@gmjs/data-manipulation';
import { invariant } from '@gmjs/util';

const MONGO_BSON_TYPES: readonly MongoJsonSchemaBsonType[] = [
  'decimal',
  'objectId',
];

export function mongoSchemaUtil(type: MongoJsonSchemaBsonType): boolean {
  return MONGO_BSON_TYPES.includes(type);
}

export function mongoBsonTypeToMongoJsType(
  type: MongoJsonSchemaBsonType
): string {
  switch (type) {
    case 'decimal':
      return 'Decimal128';
    case 'objectId':
      return 'ObjectId';
    default:
      invariant(false, `Invalid mongo bson type: '${type}'.`);
  }
}

export function getAppInterfacePropertyName(
  initialPropertyName: string
): string {
  return initialPropertyName.replace(/^_+|_+$/g, '');
}
