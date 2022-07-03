import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '../../../shared/source-file-util';

export function generateModule(
  input: SchemaToBackendAppCodeInput,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): PathContentPair {
  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);

  const filePath = path.join(moduleDir, `${entityFsName}.module.ts`);

  const repositoryType = `${typeName}Repository`;
  const serviceType = `${typeName}Service`;
  const controllerType = `${typeName}Controller`;

  const content = createTsSourceFile((sf) => {
    sf.addImportDeclarations([
      {
        namedImports: ['Module'],
        moduleSpecifier: '@nestjs/common',
      },
      {
        namedImports: [repositoryType],
        moduleSpecifier: `./${entityFsName}.repository`,
      },
      {
        namedImports: [serviceType],
        moduleSpecifier: `./${entityFsName}.service`,
      },
      {
        namedImports: [controllerType],
        moduleSpecifier: `./${entityFsName}.controller`,
      },
    ]);

    sf.addClass({
      isExported: true,
      name: `${typeName}Module`,
      decorators: [
        {
          name: 'Module',
          arguments: [
            [
              '{',
              '  imports: [],',
              `  controllers: [${controllerType}],`,
              `  providers: [${serviceType}, ${repositoryType}],`,
              `  exports: [${serviceType}, ${repositoryType}],`,
              '}',
            ].join('\n'),
          ],
        },
      ],
    });
  }, undefined);

  return {
    path: filePath,
    content,
  };
}
