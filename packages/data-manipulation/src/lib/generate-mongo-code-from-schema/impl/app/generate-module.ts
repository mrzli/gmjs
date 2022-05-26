import { Project } from 'ts-morph';
import { OptionsHelper } from '../util/options-helper';
import { MongoJsonSchemaTypeObject } from '../../../data-model/mongo-json-schema';
import { kebabCase, pascalCase } from '@gmjs/lib-util';
import path from 'path';
import { PLACEHOLDER_MODULE_NAME_NESTJS_COMMON } from '../util/placeholders';

export function generateModule(
  project: Project,
  optionsHelper: OptionsHelper,
  schema: MongoJsonSchemaTypeObject,
  moduleDir: string
): void {
  const entityFsName = kebabCase(schema.title);
  const typeName = pascalCase(schema.title);

  const filePath = path.join(moduleDir, `${entityFsName}.module.ts`);
  const sf = project.createSourceFile(filePath);

  const repositoryType = `${typeName}Repository`;
  const serviceType = `${typeName}Service`;
  const controllerType = `${typeName}Controller`;

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
}
