import { SchemaToCliAppCodeInput } from '../schema-to-cli-app-code-input';
import { ImportDeclarationStructure, OptionalKind } from 'ts-morph';
import { createTsSourceFile } from '../../../shared/source-file-util';

export function generateMainCode(input: SchemaToCliAppCodeInput): string {
  return createTsSourceFile((sf) => {
    const appsMonorepo = input.options.appsMonorepo;

    const importDeclarations = createImportDeclarations(input);
    sf.addImportDeclarations(importDeclarations);

    sf.addFunction({
      name: 'runCli',
      isAsync: true,
      parameters: [{ name: 'args', type: 'readonly string[]' }],
      returnType: 'Promise<void>',
      statements: [
        "invariant(args.length > 0, 'Missing CLI command parameter.');",
        '',
        'const cliCommand = args[0];',
        '',
        (writer) => {
          writer
            .write('const dbParams: MongoConnectionParameters = ')
            .inlineBlock(() => {
              writer
                .writeLine("host: 'localhost',")
                .writeLine('port: 27017,')
                .write(`dbName: '${appsMonorepo.projectName}',`);
            })
            .write(';');
        },
        '',
        (writer) => {
          writer.write('switch (cliCommand) ').block(() => {
            writer
              .writeLine("case 'create-db':")
              .indent(() => {
                writer
                  .writeLine(
                    `await createDb(dbParams, getSchemasFromDir('${appsMonorepo.libsDir}/${appsMonorepo.projectName}-data-model/assets/schemas'));`
                  )
                  .writeLine('break;');
              })
              .writeLine("case 'drop-db':")
              .indent(() => {
                writer.writeLine('await dropDb(dbParams);').writeLine('break;');
              })
              .writeLine("case 'seed-db':")
              .indent(() => {
                writer.writeLine('await seedDb(dbParams);').writeLine('break;');
              })
              .writeLine('default:')
              .indent(() => {
                writer
                  .writeLine(
                    "invariant(false, `Invalid CLI command: '${cliCommand}'.`);"
                  )
                  .writeLine('break;');
              });
          });
        },
      ],
    });

    sf.addStatements([
      (writer) => {
        writer
          .newLine()
          .writeLine('runCli(process.argv.slice(2))')
          .indent(() => {
            writer
              .write('.catch((e) => ')
              .inlineBlock(() => {
                writer.write('console.error(e);');
              })
              .writeLine(')')
              .write('.finally(() => ')
              .inlineBlock(() => {
                writer.write("console.log('Finished!');");
              })
              .writeLine(');');
          });
      },
    ]);
  });
}

function createImportDeclarations(
  input: SchemaToCliAppCodeInput
): readonly OptionalKind<ImportDeclarationStructure>[] {
  const libsMonorepo = input.options.libsMonorepo;
  return [
    {
      namedImports: ['invariant'],
      moduleSpecifier: `@${libsMonorepo.npmScope}/${libsMonorepo.utilProjectName}`,
    },
    {
      namedImports: [
        'createDb',
        'dropDb',
        'getSchemasFromDir',
        'MongoConnectionParameters',
      ],
      moduleSpecifier: `@${libsMonorepo.npmScope}/${libsMonorepo.mongoUtilProjectName}`,
    },
    {
      namedImports: ['seedDb'],
      moduleSpecifier: './app/mongo/seed-db',
    },
  ];
}
