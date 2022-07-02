import { MongoBsonType } from '../../../shared/mongo-bson-type';

export interface MongoAllCollectionsStructure {
  readonly collectionTypes: readonly MongoEntityStructure[];
  readonly embeddedTypes: readonly MongoEntityStructure[];
}

export interface MongoCollectionStructure {
  readonly collectionType: MongoEntityStructure;
  readonly embeddedTypes: readonly MongoEntityStructure[];
}

export interface MongoEntityStructure {
  readonly name: string;
  readonly properties: readonly MongoPropertyStructure[];
  readonly mongoTypes: readonly MongoBsonType[];
  readonly embeddedTypes: readonly string[];
}

export interface MongoPropertyStructure {
  readonly name: string;
  readonly isOptional: boolean;
  readonly valueType: MongoValueTypeStructureAny;
}

export interface MongoValueTypeStructureBase {
  readonly bsonType: MongoBsonType;
}

export interface MongoValueTypeStructureObject
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'object';
  readonly typeName: string;
}

export interface MongoValueTypeStructureArray
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'array';
  readonly items: MongoValueTypeStructureAny;
}

export interface MongoValueTypeStructureString
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'string';
  readonly pattern?: string;
  readonly enum?: readonly string[];
}

export interface MongoValueTypeStructureNumberBase
  extends MongoValueTypeStructureBase {
  readonly minimum?: number;
  readonly exclusiveMinimum?: number;
  readonly maximum?: number;
  readonly exclusiveMaximum?: number;
}

export interface MongoValueTypeStructureInt
  extends MongoValueTypeStructureNumberBase {
  readonly bsonType: 'int';
}

export interface MongoValueTypeStructureLong
  extends MongoValueTypeStructureNumberBase {
  readonly bsonType: 'long';
}

export interface MongoValueTypeStructureDecimal
  extends MongoValueTypeStructureNumberBase {
  readonly bsonType: 'decimal';
}

export interface MongoValueTypeStructureBool
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'bool';
}

export interface MongoValueTypeStructureObjectId
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'objectId';
}

export interface MongoValueTypeStructureDate
  extends MongoValueTypeStructureBase {
  readonly bsonType: 'date';
}

export type MongoValueTypeStructureAny =
  | MongoValueTypeStructureObject
  | MongoValueTypeStructureArray
  | MongoValueTypeStructureString
  | MongoValueTypeStructureInt
  | MongoValueTypeStructureLong
  | MongoValueTypeStructureDecimal
  | MongoValueTypeStructureBool
  | MongoValueTypeStructureObjectId
  | MongoValueTypeStructureDate;
