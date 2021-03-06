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
import {
  OBJECT_REMOVE_UNDEFINED_FN_NAME,
  TRANSFORM_IF_EXISTS_FN_NAME,
} from './constants';
import { ImmutableMap, invariant } from '@gmjs/util';
import { getAppInterfacePropertyName } from '../../../../shared/mongo-schema-util';
import { MongoBsonType } from '@gmjs/mongo-util';

export function getAppToDbMapperFunctionName(entityName: string): string {
  const typeName = pascalCase(entityName);
  return `app${typeName}ToDb${typeName}`;
}

export function createAppToDbMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const functionName = getAppToDbMapperFunctionName(entity.name);

  return createAppToDbMapperFunctionDeclarationInternal(
    entity,
    dbPrefix,
    appPrefix,
    functionName,
    appTypeName,
    dbTypeName,
    false,
    []
  );
}

export function createAppToDbMapperMainCollectionFunctionDeclaration(
  entityName: string,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entityName);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const functionName = getAppToDbMapperFunctionName(entityName);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer
      .write('return ')
      .inlineBlock(() => {
        writeAppToDbConvertablePropertyAssignment(
          writer,
          '_id',
          false,
          appVariableName,
          appToDbObjectIdConversion
        );
        writer.newLine();
        writer.write(`...${functionName}WithoutId(${appVariableName}),`);
      })
      .write(';');
  };

  return {
    name: functionName,
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: appVariableName,
        type: appTypeName,
      },
    ],
    returnType: dbTypeName,
    statements: [statement],
  };
}

export function createAppToDbWithoutIdMapperFunctionDeclaration(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const dbTypeName = pascalCase(`${dbPrefix}${typeName}`);
  const appTypeName = pascalCase(`${appPrefix}${typeName}`);

  const functionName = `${getAppToDbMapperFunctionName(entity.name)}WithoutId`;
  const inputType = `WithoutId<${appTypeName}>`;
  const returnType = `DbWithoutId<${dbTypeName}>`;

  return createAppToDbMapperFunctionDeclarationInternal(
    entity,
    dbPrefix,
    appPrefix,
    functionName,
    inputType,
    returnType,
    false,
    ['_id']
  );
}

export function createAppToDbMapperFunctionDeclarationInternal(
  entity: MongoEntityStructure,
  dbPrefix: string,
  appPrefix: string,
  functionName: string,
  inputType: string,
  returnType: string,
  isPartial: boolean,
  propertiesToOmit: readonly string[]
): OptionalKind<FunctionDeclarationStructure> {
  const typeName = pascalCase(entity.name);
  const appVariableName = camelCase(`${appPrefix}${typeName}`);

  const statement: WriterFunction = (writer: CodeBlockWriter) => {
    writer
      .write(
        isPartial ? `return ${OBJECT_REMOVE_UNDEFINED_FN_NAME}(` : 'return '
      )
      .inlineBlock(() => {
        const propertiesToOmitSet = new Set<string>(propertiesToOmit);

        const properties = entity.properties;
        for (let i = 0; i < properties.length; i++) {
          const property = properties[i];
          if (propertiesToOmitSet.has(property.name)) {
            continue;
          }

          writeAppToDbPropertyAssignment(
            writer,
            property,
            appVariableName,
            isPartial
          );
          writer.conditionalNewLine(i !== properties.length - 1);
        }
      })
      .write(isPartial ? ');' : ';');
  };

  return {
    name: functionName,
    isExported: true,
    isAsync: false,
    parameters: [
      {
        name: appVariableName,
        type: inputType,
      },
    ],
    returnType: returnType,
    statements: [statement],
  };
}

function writeAppToDbPropertyAssignment(
  writer: CodeBlockWriter,
  property: MongoPropertyStructure,
  appVariableName: string,
  allOptional: boolean
): void {
  const type = property.valueType.bsonType;
  const propertyName = property.name;
  const isOptional = property.isOptional || allOptional;
  const appPropertyName = getAppInterfacePropertyName(propertyName);

  switch (type) {
    case 'string':
    case 'int':
    case 'bool':
      writer.write(`${propertyName}: ${appVariableName}.${appPropertyName},`);
      break;
    case 'long':
    case 'double':
    case 'decimal':
    case 'objectId':
    case 'date':
      writeAppToDbConvertablePropertyAssignment(
        writer,
        propertyName,
        isOptional,
        appVariableName,
        APP_TO_DB_CONVERSION_MAP.getOrThrow(type)
      );
      break;
    case 'array':
      writeAppToDbArrayPropertyAssignment(
        writer,
        propertyName,
        isOptional,
        property.valueType,
        appVariableName
      );
      break;
    case 'object':
      writeAppToDbObjectPropertyAssignment(
        writer,
        propertyName,
        isOptional,
        property.valueType,
        appVariableName
      );
      break;
    default:
      invariant(false, `Invalid property type: '${type}'.`);
  }
}

function writeAppToDbConvertablePropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  appVariableName: string,
  converter: (fieldStr: string) => string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);
  const appPropertyAccess = `${appVariableName}.${appPropertyName}`;
  const mapperFn = `(value) => ${converter('value')}`;

  const valueRight = isOptional
    ? `${TRANSFORM_IF_EXISTS_FN_NAME}(${appPropertyAccess}, ${mapperFn}, undefined)`
    : converter(appPropertyAccess);

  writer.write(`${propertyName}: ${valueRight},`);
}

function writeAppToDbArrayPropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  valueType: MongoValueTypeStructureArray,
  appVariableName: string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);

  const itemType = valueType.items.bsonType;

  const isOptionalToken = isOptional ? '?' : '';

  switch (itemType) {
    case 'string':
    case 'int':
    case 'bool':
      writer.write(`${propertyName}: ${appVariableName}.${appPropertyName},`);
      break;
    case 'long':
    case 'double':
    case 'decimal':
    case 'objectId':
    case 'date':
      writeAppToDbArrayWithMapping(
        writer,
        propertyName,
        appPropertyName,
        appVariableName,
        isOptionalToken,
        APP_TO_DB_CONVERSION_MAP.getOrThrow(itemType)('item')
      );
      break;
    case 'array':
      invariant(
        false,
        `Arrays of arrays are currently not supported (array item type cannot be an array).`
      );
      break;
    case 'object': {
      const mapperFunctionName = getAppToDbMapperFunctionName(
        valueType.items.typeName
      );
      writer.write(
        `${propertyName}: ${appVariableName}.${propertyName}${isOptionalToken}.map(${mapperFunctionName}),`
      );
      break;
    }
    default:
      invariant(false, `Invalid property array item type: '${itemType}'.`);
  }
}

function writeAppToDbArrayWithMapping(
  writer: CodeBlockWriter,
  propertyName: string,
  appPropertyName: string,
  appVariableName: string,
  isOptionalToken: string,
  valueMapper: string
): void {
  writer.write(
    `${propertyName}: ${appVariableName}.${appPropertyName}${isOptionalToken}.map((item) => ${valueMapper}),`
  );
}

function writeAppToDbObjectPropertyAssignment(
  writer: CodeBlockWriter,
  propertyName: string,
  isOptional: boolean,
  valueType: MongoValueTypeStructureObject,
  appVariableName: string
): void {
  const appPropertyName = getAppInterfacePropertyName(propertyName);
  const mapperFunctionName = getAppToDbMapperFunctionName(valueType.typeName);
  const appPropertyAccess = `${appVariableName}.${appPropertyName}`;

  const valueRight = isOptional
    ? `${TRANSFORM_IF_EXISTS_FN_NAME}(${appPropertyAccess}, ${mapperFunctionName}, undefined)`
    : `${mapperFunctionName}(${appPropertyAccess})`;

  writer.write(`${propertyName}: ${valueRight},`);
}

type AppToDbConversion = (fieldStr: string) => string;

const APP_TO_DB_CONVERSION_MAP = ImmutableMap.fromTupleArray<
  MongoBsonType,
  AppToDbConversion
>([
  ['long', appToDbLongConversion],
  ['double', appToDbDoubleConversion],
  ['decimal', appToDbDecimalConversion],
  ['objectId', appToDbObjectIdConversion],
  ['date', appToDbDateConversion],
]);

function appToDbLongConversion(fieldStr: string): string {
  return `new Long(${fieldStr})`;
}

function appToDbDoubleConversion(fieldStr: string): string {
  return `new Double(${fieldStr})`;
}

function appToDbDecimalConversion(fieldStr: string): string {
  return `new Decimal128(${fieldStr})`;
}

function appToDbObjectIdConversion(fieldStr: string): string {
  return `new ObjectId(${fieldStr})`;
}

function appToDbDateConversion(fieldStr: string): string {
  return `new Date(${fieldStr})`;
}
