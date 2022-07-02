import {
  ImportDeclarationStructure,
  OptionalKind,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';
import { invariant } from '@gmjs/util';

export function addImports(
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

export function addNestModuleImports(
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
