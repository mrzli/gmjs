import { SchemaToCliAppCodeInput } from '../schema-to-cli-app-code-input';
import { ImportDeclarationStructure, OptionalKind } from 'ts-morph';
import { createTsSourceFile } from '../../../shared/source-file-util';
import { getSchemasDir } from '../../shared/util';
import { MODULE_NAME_GMJS_LIB_UTIL, MODULE_NAME_GMJS_MONGO_UTIL, MODULE_NAME_GMJS_UTIL } from '../../shared/constants';

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
                .write(`dbName: '${appsMonorepo.baseProjectName}',`);
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
                    `await createDb(dbParams, getSchemasFromDir('${getSchemasDir(
                      appsMonorepo
                    )}'));`
                  )
                  .writeLine('break;');
              })
              .writeLine("case 'drop-db':")
              .indent(() => {
                writer.writeLine('await dropDb(dbParams);').writeLine('break;');
              })
              .writeLine("case 'seed-db':")
              .indent(() => {
                writer
                  .writeLine(
                    'await seedDb(dbParams).catch(logErrorWithFullValueAndRethrow);'
                  )
                  .writeLine('break;');
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
  return [
    {
      namedImports: ['invariant'],
      moduleSpecifier: MODULE_NAME_GMJS_UTIL,
    },
    {
      namedImports: [
        'createDb',
        'dropDb',
        'getSchemasFromDir',
        'MongoConnectionParameters',
      ],
      moduleSpecifier: MODULE_NAME_GMJS_MONGO_UTIL,
    },
    {
      namedImports: ['logErrorWithFullValueAndRethrow'],
      moduleSpecifier: MODULE_NAME_GMJS_LIB_UTIL,
    },
    {
      namedImports: ['seedDb'],
      moduleSpecifier: './app/mongo/seed-db',
    },
  ];
}
