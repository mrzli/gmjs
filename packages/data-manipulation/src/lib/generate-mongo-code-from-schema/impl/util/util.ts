import path from 'path';
import { pathWithoutExtension } from '@gmjs/fs-util';
import { MongoJsonSchemaBsonType } from '../../../data-model/mongo-json-schema';
import { invariant } from '@gmjs/util';

export function getRelativeImportPath(
  importingFilePath: string,
  filePathToImport: string
): string {
  const relativePath = pathWithoutExtension(
    path.relative(path.dirname(importingFilePath), filePathToImport)
  );
  const importPath = relativePath.endsWith('index')
    ? path.dirname(relativePath)
    : relativePath;
  return `./${importPath}`;
}

const MONGO_BSON_TYPES: readonly MongoJsonSchemaBsonType[] = [
  'decimal',
  'objectId',
];

export function isMongoBsonType(type: MongoJsonSchemaBsonType): boolean {
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
