import { MongoJsonSchemaTypeObject } from '@gmjs/mongo-util';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import {
  PLACEHOLDER_MAP,
  PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
} from './placeholders';
import { createTsSourceFile } from '../../../shared/code-util';
import { SchemaToBackendAppCodeInput } from '../schema-to-backend-app-code-input';
import { PathContentPair } from '@gmjs/fs-util';

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

  const content = createTsSourceFile(
    (sf) => {
      // performance issues when not using a placeholder
      sf.addImportDeclarations([
        {
          namedImports: ['Module'],
          moduleSpecifier: PLACEHOLDER_MODULE_NAME_NESTJS_COMMON,
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
    },
    undefined,
    PLACEHOLDER_MAP
  );

  return {
    path: filePath,
    content,
  };
}
