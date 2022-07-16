import { AddMongoDatabaseToBackendInput } from './add-mongo-database-to-backend-input';
import { appendImports, appendNestModuleImports } from '../../shared/code-util';
import { SourceFile, SyntaxKind, WriterFunction } from 'ts-morph';
import { kebabCase } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../shared/source-file-util';
import { MODULE_NAME_GMJS_NEST_UTIL } from '../shared/constants';

export function addMongoDatabaseToBackend(
  input: AddMongoDatabaseToBackendInput
): string {
  return createTsSourceFile((sf) => {
    appendImports(sf, [
      {
        namedImports: ['MongoDatabaseConfigOptions', 'MongoDatabaseModule'],
        moduleSpecifier: MODULE_NAME_GMJS_NEST_UTIL,
      },
    ]);

    addMongoConfigOptionStatement(sf, input);

    appendNestModuleImports(sf, 'AppModule', [
      'MongoDatabaseModule.register(MONGO_CONFIG_OPTIONS)',
    ]);
  }, input.appModuleFile);
}

function addMongoConfigOptionStatement(
  sf: SourceFile,
  input: AddMongoDatabaseToBackendInput
): void {
  const allStatements = sf.getStatements();
  const appModuleStatementIndex = allStatements.findIndex((s) =>
    s.isKind(SyntaxKind.ClassDeclaration)
  );

  const statement: WriterFunction = (writer) => {
    writer
      .newLine()
      .write('const MONGO_CONFIG_OPTIONS: MongoDatabaseConfigOptions = ')
      .inlineBlock(() => {
        writer
          .writeLine("host: 'localhost',")
          .writeLine('port: 27017,')
          .write(`dbName: '${kebabCase(input.options.baseProjectName)}',`);
      });
  };

  sf.insertStatements(appModuleStatementIndex, [statement]);
}
