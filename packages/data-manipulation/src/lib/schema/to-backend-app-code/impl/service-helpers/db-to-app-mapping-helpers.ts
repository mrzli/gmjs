import {
  MongoEntityStructure,
  MongoPropertyStructure,
  MongoValueTypeStructureArray,
  MongoValueTypeStructureObject,
} from '../../../../shared/collection-structure/mongo-collection-structure';
import {
  CodeBlockWriter,
  FunctionDeclarationStructure,
  OptionalKind,
  WriterFunction,
} from 'ts-morph';
import { camelCase, pascalCase } from '@gmjs/lib-util';
import { invariant } from '@gmjs/util';
import { TRANSFORM_IF_EXISTS_FN_NAME } from './constants';
import { getAppInterfacePropertyName } from '../../../../shared/mongo-schema-util';

export function getDbToAppMapperFunctionName(entityName: string): string {
  const typeName = pascalCase(entityName);
  return `db${typeName}ToApp${typeName}`;
}

export function createDbToAppMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const dbVariableName = camelCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer
      .write('return')
      .block(() => {
        const properties = entity.properties;
        for (const property of properties) {
          writeDbToAppPropertyAssignment(writer, property, dbVariableName);
          writer.conditionalNewLine(
            property !== properties[properties.length - 1]
          );
        }
      })
      .write(';');
  };

  return {
    name: getDbToAppMapperFunctionName(entity.name),
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: dbVariableName,
        type: dbTypeName,
      },
    ],
    returnType: appTypeName,
    statements: [statement],
  };
}

function writeDbToAppPropertyAssignment(
  writer: CodeBlockWriter,
  property: MongoPropertyStructure,
  dbVariableName: string
): void {
  const type = property.valueType.bsonType;
  const propertyName = property.name;
  const isOptional = property.isOptional;
  const appPropertyName = getAppInterfacePropertyName(propertyName);

  switch (type) {
    case 'string':
    case 'long':
    case 'int':
    case 'bool':
      writer.write(`${appPropertyName}: ${dbVariableName}.${propertyName},`);
      break;
    case 'decimal':
      writeDbToAppConvertablePropertyAssignment(
        writer,
        propertyName,
        isOptional,
        dbVariableName,
        dbToAppDecimalConversion
      );
      break;
    case 'objectId':
      writeDbToAppConvertablePropertyAssignment(
        writer,
        propertyName,
        isOptional,
        dbVariableName,
        dbToAppObjectIdConversion
      );
      break;
    case 'date':
      writeDbToAppConvertablePropertyAssignment(
        writer,
        propertyName,
        isOptional,
        dbVariableName,
        dbToAppDateConversion
      );
      break;
    case 'array':
      writeDbToAppArrayPropertyAssignment(
        writer,
        propertyName,
        property.isOptional,
        property.valueType,
        dbVariableName
      );
      break;
    case 'object':
      writeDbToAppObjectPropertyAssignment(
        writer,
        propertyName,
        property.isOptional,
        property.valueType,
        dbVariableName
      );
      break;
    default:
      invariant(false, `Invalid property type: '${type}'.`);
  }
}

function writeDbToAppConvertablePropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  dbVariableName: string,
  converter: (fieldStr: string) => string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);
  const isOptionalToken = isOptional ? '?' : '';

  const valueRight = converter(
    `${dbVariableName}.${propertyName}${isOptionalToken}`
  );
  writer.write(`${appPropertyName}: ${valueRight},`);
}

function writeDbToAppArrayPropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  valueType: MongoValueTypeStructureArray,
  dbVariableName: string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);

  const itemType = valueType.items.bsonType;

  const isOptionalToken = isOptional ? '?' : '';

  switch (itemType) {
    case 'string':
    case 'long':
    case 'int':
    case 'bool':
      writer.write(`${appPropertyName}: ${dbVariableName}.${propertyName},`);
      break;
    case 'decimal':
      writeDbToAppArrayWithMapping(
        writer,
        propertyName,
        dbVariableName,
        isOptionalToken,
        dbToAppDecimalConversion('item')
      );
      break;
    case 'objectId':
      writeDbToAppArrayWithMapping(
        writer,
        propertyName,
        dbVariableName,
        isOptionalToken,
        dbToAppObjectIdConversion('item')
      );
      break;
    case 'date':
      writeDbToAppArrayWithMapping(
        writer,
        propertyName,
        dbVariableName,
        isOptionalToken,
        dbToAppDateConversion('item')
      );
      break;
    case 'array':
      invariant(
        false,
        `Arrays of arrays are currently not supported (array item type cannot be an array).`
      );
      break;
    case 'object': {
      const mapperFunctionName = getDbToAppMapperFunctionName(
        valueType.items.typeName
      );
      writer.write(
        `${appPropertyName}: ${dbVariableName}.${propertyName}${isOptionalToken}.map(${mapperFunctionName}),`
      );
      break;
    }
    default:
      invariant(false, `Invalid property array item type: '${itemType}'.`);
  }
}

function writeDbToAppArrayWithMapping(
  writer: CodeBlockWriter,
  propertyName: string,
  dbVariableName: string,
  isOptionalToken: string,
  valueMapper: string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);

  writer.write(
    `${appPropertyName}: ${dbVariableName}.${propertyName}${isOptionalToken}.map((item) => ${valueMapper}),`
  );
}

function writeDbToAppObjectPropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  valueType: MongoValueTypeStructureObject,
  dbVariableName: string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);
  const mapperFunctionName = getDbToAppMapperFunctionName(valueType.typeName);
  const dbPropertyAccess = `${dbVariableName}.${propertyName}`;

  const valueRight = isOptional
    ? `${TRANSFORM_IF_EXISTS_FN_NAME}(${dbPropertyAccess}, ${mapperFunctionName}, undefined)`
    : `${mapperFunctionName}(${dbPropertyAccess})`;

  writer.write(`${appPropertyName}: ${valueRight},`);
}

function dbToAppDecimalConversion(fieldStr: string): string {
  return `${fieldStr}.toString()`;
}

function dbToAppObjectIdConversion(fieldStr: string): string {
  return `${fieldStr}.toString()`;
}

function dbToAppDateConversion(fieldStr: string): string {
  return `${fieldStr}.toISOString()`;
}
