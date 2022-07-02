import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import {
  ImportDeclarationStructure,
  OptionalKind,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';
import { invariant, sortArrayByStringAsc } from '@gmjs/util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import { CodeFileResult, createTsSourceFile } from '../../shared/code-util';

export function addEntityModulesToAppModule(
  input: SchemaToBackendAppCodeInput
): CodeFileResult {
  const appModuleFilePath = 'app/app.module.ts';
  const content = createTsSourceFile((sf) => {
    const entityNames = sortArrayByStringAsc(
      input.schemas.map((schema) => schema.title)
    );

    addImports(sf, entityNames);
    addModuleImports(sf, entityNames);
  }, input.initialFiles.appModule);

  return {
    path: appModuleFilePath,
    content,
  };
}

function addImports(
  appModuleSf: SourceFile,
  entityNames: readonly string[]
): void {
  const statements = appModuleSf.getStatements();

  // new imports will go before first non-import statement
  const importIndex = statements.findIndex(
    (s) => !s.isKind(SyntaxKind.ImportDeclaration)
  );
  const actualImportIndex = importIndex >= 0 ? importIndex : 0;

  const importDeclarations: readonly OptionalKind<ImportDeclarationStructure>[] =
    entityNames.map((name) => {
      const entityFsName = kebabCase(name);
      return {
        namedImports: [getModuleName(name)],
        moduleSpecifier: `./${entityFsName}/${entityFsName}.module`,
      };
    });

  appModuleSf.insertImportDeclarations(actualImportIndex, importDeclarations);
}

function addModuleImports(
  appModuleSf: SourceFile,
  entityNames: readonly string[]
): void {
  const entityModuleNames = entityNames.map(getModuleName);

  const importsArray = appModuleSf
    .getClass('AppModule')
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
  importsArray.addElements(entityModuleNames);
}

function getModuleName(entityName: string): string {
  return pascalCase(entityName) + 'Module';
}
