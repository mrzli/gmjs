import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeArray,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import { objectGetEntries } from '@gmjs/util';

export type MongoJsonSchemaVisitor<TVisitorParameter> = (
  schema: MongoJsonSchemaAnyType,
  propertyContext: MongoJsonSchemaPropertyContext | undefined,
  parameter: TVisitorParameter | undefined
) => void;

export interface MongoJsonSchemaPropertyContext {
  readonly propertyName: string;
  readonly propertyIndex: number;
  readonly totalNumPropertiesInObject: number;
}

export function mongoSchemaVisit<TVisitorParameter>(
  schema: MongoJsonSchemaAnyType,
  visitor: MongoJsonSchemaVisitor<TVisitorParameter>,
  parameter?: TVisitorParameter
): void {
  visitAnyType(schema, visitor, undefined, parameter);
}

function visitAnyType<TVisitorParameter>(
  schema: MongoJsonSchemaAnyType,
  visitor: MongoJsonSchemaVisitor<TVisitorParameter>,
  propertyContext: MongoJsonSchemaPropertyContext | undefined,
  parameter: TVisitorParameter | undefined
): void {
  switch (schema.bsonType) {
    case 'string':
    case 'int':
    case 'long':
    case 'bool':
    case 'decimal':
    case 'objectId':
    case 'date':
      visitor(schema, propertyContext, parameter);
      break;
    case 'object':
      visitObject(schema, visitor, propertyContext, parameter);
      break;
    case 'array':
      visitArray(schema, visitor, propertyContext, parameter);
      break;
  }
}

function visitObject<TVisitorParameter>(
  schema: MongoJsonSchemaTypeObject,
  visitor: MongoJsonSchemaVisitor<TVisitorParameter>,
  propertyContext: MongoJsonSchemaPropertyContext | undefined,
  parameter: TVisitorParameter | undefined
): void {
  visitor(schema, propertyContext, parameter);

  const properties = objectGetEntries(schema.properties);
  const numProperties = properties.length;
  for (let i = 0; i < numProperties; i++) {
    const { key, value } = properties[i];
    const currentPropertyContext: MongoJsonSchemaPropertyContext = {
      propertyName: key,
      propertyIndex: i,
      totalNumPropertiesInObject: numProperties,
    };

    visitAnyType(value, visitor, currentPropertyContext, parameter);
  }
}

function visitArray<TVisitorParameter>(
  schema: MongoJsonSchemaTypeArray,
  visitor: MongoJsonSchemaVisitor<TVisitorParameter>,
  propertyContext: MongoJsonSchemaPropertyContext | undefined,
  parameter: TVisitorParameter | undefined
): void {
  visitor(schema, propertyContext, parameter);
  visitAnyType(schema.items, visitor, undefined, parameter);
}
