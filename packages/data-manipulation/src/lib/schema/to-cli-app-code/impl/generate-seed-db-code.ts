import { SchemaToCliAppCodeInput } from '../schema-to-cli-app-code-input';
import { createTsSourceFile } from '../../../shared/source-file-util';
import {
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeArray,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import {
  CodeBlockWriter,
  FunctionDeclarationStructure,
  ImportDeclarationStructure,
  OptionalKind,
  WriterFunction,
} from 'ts-morph';
import { pascalCase } from '@gmjs/lib-util';
import { DEFAULT_DATE, DEFAULT_OBJECT_ID } from '../../../shared/constants';
import { invariant, objectGetEntries } from '@gmjs/util';
import { getMongoTypeImports } from '../../../shared/code-util';

export function generateSeedDbCode(input: SchemaToCliAppCodeInput): string {
  return createTsSourceFile((sf) => {
    const importDeclarations = createImportDeclarations(input);
    sf.addImportDeclarations(importDeclarations);

    const seedDbFunction = createSeedDbFunction(input.schemas);
    sf.addFunction(seedDbFunction);
  });
}

function createImportDeclarations(
  input: SchemaToCliAppCodeInput
): readonly OptionalKind<ImportDeclarationStructure>[] {
  const libsMonorepo = input.options.libsMonorepo;
  const appsMonorepo = input.options.appsMonorepo;

  const mongoUtilModule = `@${libsMonorepo.npmScope}/${libsMonorepo.mongoUtilProjectName}`;
  const sharedLibModule = `@${appsMonorepo.npmScope}/${appsMonorepo.sharedLibProjectName}`;

  return [
    {
      namedImports: ['Db', ...getMongoTypeImports(input.schemas)],
      moduleSpecifier: 'mongodb',
    },
    {
      namedImports: ['executeMongo', 'insertMany', 'MongoConnectionParameters'],
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
        name: 'mongoParams',
        type: 'MongoConnectionParameters',
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
      .write(`await executeMongo(mongoParams, async (db: Db) => `)
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
  writer.write(`await insertMany(db, DbCollectionName.${entityName}, [`);
  writeObject(writer, schema);
  writer.write(']);');
}

function writeAnyValue(
  writer: CodeBlockWriter,
  schema: MongoJsonSchemaAnyType
): void {
  const type = schema.bsonType;

  switch (type) {
    case 'string':
      writer.write("''");
      break;
    case 'int':
      writer.write('0');
      break;
    case 'long':
      writer.write('new Long(0)');
      break;
    case 'double':
      writer.write('new Double(0)');
      break;
    case 'decimal':
      writer.write("new Decimal128('0')");
      break;
    case 'bool':
      writer.write('false');
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
    default:
      invariant(false, `Invalid property type: '${type}'.`);
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
