import { invariant } from '@gmjs/util';
import { MongoBsonType } from '../../shared/mongo-bson-type';

const MONGO_BSON_TYPES: readonly MongoBsonType[] = ['decimal', 'objectId'];

export function isMongoValueType(type: MongoBsonType): boolean {
  return MONGO_BSON_TYPES.includes(type);
}

export function mongoBsonTypeToMongoJsType(type: MongoBsonType): string {
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
