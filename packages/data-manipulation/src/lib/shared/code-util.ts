import prettier from 'prettier';
import {
  asChainable,
  ImmutableMap,
  invariant,
  sortArrayByStringAsc,
} from '@gmjs/util';
import {
  ImportDeclarationStructure,
  IndentationText,
  OptionalKind,
  Project,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';
import { pathWithoutExtension } from '@gmjs/fs-util';
import path from 'path';
import {
  MongoBsonType,
  MongoJsonSchemaAnyType,
  MongoJsonSchemaTypeObject,
} from '@gmjs/mongo-util';
import {
  MongoJsonSchemaPropertyContext,
  MongoJsonSchemaVisitor,
  mongoSchemaVisit,
} from './mongo/mongo-schema-visit/mongo-schema-visit';
import {
  isMongoValueType,
  mongoBsonTypeToMongoJsType,
} from './mongo-schema-util';

export function createTsSourceFile(
  writer: (sf: SourceFile) => void,
  initialText?: string,
  placeholderMap?: ImmutableMap<string, string>
): string {
  const project = new Project({
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
    },
  });
  const sf = project.createSourceFile('source-file.ts', initialText);
  writer(sf);
  return processTsSourceFile(sf.getFullText(), placeholderMap);
}

export function processTsSourceFile(
  sourceFileText: string,
  placeholderMap?: ImmutableMap<string, string>
): string {
  let replacedText = sourceFileText;
  if (placeholderMap !== undefined) {
    for (const { key, value } of placeholderMap.entryPairs()) {
      replacedText = replacedText.replace(key, value);
    }
  }

  return prettier.format(replacedText, {
    singleQuote: true,
    parser: 'typescript',
  });
}

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

export function appendImports(
  sf: SourceFile,
  importDeclarations: readonly OptionalKind<ImportDeclarationStructure>[]
): void {
  const statements = sf.getStatements();

  // new imports will go before first non-import statement
  const importIndex = statements.findIndex(
    (s) => !s.isKind(SyntaxKind.ImportDeclaration)
  );
  const actualImportIndex = importIndex >= 0 ? importIndex : 0;
  sf.insertImportDeclarations(actualImportIndex, importDeclarations);
}

export function appendNestModuleImports(
  sf: SourceFile,
  moduleName: string,
  identifiers: readonly string[]
): void {
  const importsArray = sf
    .getClass(moduleName)
    ?.getDecoratorOrThrow('Module')
    ?.getArguments()?.[0]
    ?.asKind(SyntaxKind.ObjectLiteralExpression)
    ?.getProperty('imports')
    ?.asKind(SyntaxKind.PropertyAssignment)
    ?.getInitializer()
    ?.asKind(SyntaxKind.ArrayLiteralExpression);
  invariant(
    importsArray !== undefined,
    'Error getting AppModule imports array.'
  );
  importsArray.addElements(identifiers);
}

export function getMongoTypeImports(
  schemas: readonly MongoJsonSchemaTypeObject[]
): readonly string[] {
  const mongoBsonTypesSet = new Set<MongoBsonType>();
  for (const schema of schemas) {
    mongoSchemaVisit(schema, GET_MONGO_BSON_TYPES_VISITOR, mongoBsonTypesSet);
  }

  return asChainable(Array.from(mongoBsonTypesSet.values()))
    .map(mongoBsonTypeToMongoJsType)
    .apply(sortArrayByStringAsc)
    .getValue();
}

const GET_MONGO_BSON_TYPES_VISITOR: MongoJsonSchemaVisitor<
  Set<MongoBsonType>
> = (
  schema: MongoJsonSchemaAnyType,
  propertyContext: MongoJsonSchemaPropertyContext | undefined,
  parameter: Set<MongoBsonType> | undefined
) => {
  if (isMongoValueType(schema.bsonType)) {
    parameter?.add(schema.bsonType);
  }
};
