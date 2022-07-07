import { ReadonlyRecord } from '@gmjs/util';
import { MongoBsonType } from './mongo-bson-type';

export interface MongoJsonSchemaTypeBase {
  readonly bsonType: MongoBsonType;
}

export interface MongoJsonSchemaTypeObject extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'object';
  readonly title: string;
  readonly properties: ReadonlyRecord<string, MongoJsonSchemaAnyType>;
  readonly required: readonly string[];
  readonly additionalProperties: false;
}

export interface MongoJsonSchemaTypeArray extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'array';
  readonly items: MongoJsonSchemaAnyType;
}

export interface MongoJsonSchemaTypeString extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'string';
  readonly pattern?: string;
  readonly enum?: readonly string[];
}

export interface MongoJsonSchemaTypeNumberBase extends MongoJsonSchemaTypeBase {
  readonly minimum?: number;
  readonly exclusiveMinimum?: boolean;
  readonly maximum?: number;
  readonly exclusiveMaximum?: boolean;
}

export interface MongoJsonSchemaTypeInt extends MongoJsonSchemaTypeNumberBase {
  readonly bsonType: 'int';
}

export interface MongoJsonSchemaTypeLong extends MongoJsonSchemaTypeNumberBase {
  readonly bsonType: 'long';
}

export interface MongoJsonSchemaTypeDouble
  extends MongoJsonSchemaTypeNumberBase {
  readonly bsonType: 'double';
}

export interface MongoJsonSchemaTypeDecimal
  extends MongoJsonSchemaTypeNumberBase {
  readonly bsonType: 'decimal';
}

export interface MongoJsonSchemaTypeBool extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'bool';
}

export interface MongoJsonSchemaTypeObjectId extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'objectId';
}

export interface MongoJsonSchemaTypeDate extends MongoJsonSchemaTypeBase {
  readonly bsonType: 'date';
}

export type MongoJsonSchemaAnyType =
  | MongoJsonSchemaTypeObject
  | MongoJsonSchemaTypeArray
  | MongoJsonSchemaTypeString
  | MongoJsonSchemaTypeInt
  | MongoJsonSchemaTypeLong
  | MongoJsonSchemaTypeDouble
  | MongoJsonSchemaTypeDecimal
  | MongoJsonSchemaTypeBool
  | MongoJsonSchemaTypeObjectId
  | MongoJsonSchemaTypeDate;
