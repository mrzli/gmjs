import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeArray,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import { objectGetEntries } from '@gmjs/util';
import { SchemaToSeedDbCodeInput } from './schema-to-seed-db-code-input';
import {
  CodeBlockWriter,
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  SourceFile,
  WriterFunction,
} from 'ts-morph';
import { pascalCase } from '@gmjs/lib-util';
import { DEFAULT_DATE, DEFAULT_OBJECT_ID } from '../../shared/constants';
import { getMongoTypeImports } from '../../shared/code-util';
import { createTsSourceFile } from '../../shared/source-file-util';

export function schemaToSeedDbCode(input: SchemaToSeedDbCodeInput): string {
  return createTsSourceFile((sf) => {
    createSeedDbCode(input, sf);
  });
}

const MONGO_COLLECTION_PARAMETERS_TYPE_NAME = 'MongoConnectionParameters';
const EXECUTE_MONGO_FUNCTION_NAME = 'executeMongo';
const INSERT_MANY_FUNCTION_NAME = 'insertMany';
const MONGO_PARAMS_PARAMETER_NAME = 'mongoParams';

function createSeedDbCode(
  input: SchemaToSeedDbCodeInput,
  sf: SourceFile
): void {
  const importDeclarations = createImportDeclarations(input);
  sf.addImportDeclarations(importDeclarations);

  const seedDbFunction = createSeedDbFunction(input.schemas);
  sf.addFunction(seedDbFunction);
}

function createImportDeclarations(
  input: SchemaToSeedDbCodeInput
): readonly OptionalKind<ImportDeclarationStructure>[] {
  const mongoUtilModule = `@${input.libsMonorepo.npmScope}/${input.libsMonorepo.mongoUtilProjectName}`;
  const sharedLibModule = `@${input.appsMonorepo.npmScope}/${input.appsMonorepo.sharedLibProjectName}`;

  return [
    {
      namedImports: ['Db', ...getMongoTypeImports(input.schemas)],
      moduleSpecifier: 'mongodb',
    },
    {
      namedImports: [
        EXECUTE_MONGO_FUNCTION_NAME,
        INSERT_MANY_FUNCTION_NAME,
        MONGO_COLLECTION_PARAMETERS_TYPE_NAME,
      ],
      moduleSpecifier: mongoUtilModule,
    },
    {
      namedImports: ['DbCollectionName'],
      moduleSpecifier: sharedLibModule,
    },
  ];
}

function createSeedDbFunction(
  schemas: readonly MongoJsonSchemaTypeObject[]
): OptionalKind<FunctionDeclarationStructure> {
  const statement = createExecuteMongoStatement(schemas);

  return {
    name: 'seedDb',
    isExported: true,
    isAsync: true,
    parameters: [
      {
        name: MONGO_PARAMS_PARAMETER_NAME,
        type: MONGO_COLLECTION_PARAMETERS_TYPE_NAME,
      },
    ],
    returnType: 'Promise<void>',
    statements: [statement],
  };
}

function createExecuteMongoStatement(
  schemas: readonly MongoJsonSchemaTypeObject[]
): WriterFunction {
  return (writer: CodeBlockWriter) => {
    writer
      .write(
        `await ${EXECUTE_MONGO_FUNCTION_NAME}(${MONGO_PARAMS_PARAMETER_NAME}, async (db: Db) => `
      )
      .inlineBlock(() => {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          writeInsertMany(writer, schema);
          writer.conditionalBlankLine(i !== schemas.length - 1);
        }
      })
      .write(');');
  };
}

function writeInsertMany(
  writer: CodeBlockWriter,
  schema: MongoJsonSchemaTypeObject
): void {
  const entityName = pascalCase(schema.title);
  writer.write(
    `await ${INSERT_MANY_FUNCTION_NAME}(db, DbCollectionName.${entityName}, [`
  );
  writeObject(writer, schema);
  writer.write(']);');
}

function writeAnyValue(
  writer: CodeBlockWriter,
  schema: MongoJsonSchemaAnyType
): void {
  switch (schema.bsonType) {
    case 'string':
      writer.write("''");
      break;
    case 'int':
      writer.write('0');
      break;
    case 'long':
      writer.write('0');
      break;
    case 'bool':
      writer.write('false');
      break;
    case 'decimal':
      writer.write("new Decimal128('0')");
      break;
    case 'objectId':
      writer.write(`new ObjectId('${DEFAULT_OBJECT_ID}')`);
      break;
    case 'date':
      writer.write(`new Date('${DEFAULT_DATE}')`);
      break;
    case 'object':
      writeObject(writer, schema);
      break;
    case 'array':
      writeArray(writer, schema);
      break;
  }
}

function writeObject(
  writer: CodeBlockWriter,
  schema: MongoJsonSchemaTypeObject
): void {
  writer.inlineBlock(() => {
    const properties = objectGetEntries(schema.properties);
    for (let i = 0; i < properties.length; i++) {
      const { key, value } = properties[i];
      if (key === '_id') {
        continue;
      }

      writer.write(`${key}: `);
      writeAnyValue(writer, value);
      writer.write(',');
      writer.conditionalNewLine(i !== properties.length - 1);
    }
  });
}

function writeArray(
  writer: CodeBlockWriter,
  schema: MongoJsonSchemaTypeArray
): void {
  writer.write('[');
  writeAnyValue(writer, schema.items);
  writer.write(']');
}
