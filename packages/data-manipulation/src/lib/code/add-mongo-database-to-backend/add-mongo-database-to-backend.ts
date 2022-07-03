import { AddMongoDatabaseToBackendInput } from './add-mongo-database-to-backend-input';
import { appendImports, appendNestModuleImports } from '../../shared/code-util';
import { SourceFile, SyntaxKind, WriterFunction } from 'ts-morph';
import { kebabCase } from '@gmjs/lib-util';
import { createTsSourceFile } from '../../shared/source-file-util';

export function addMongoDatabaseToBackend(
  input: AddMongoDatabaseToBackendInput
): string {
  return createTsSourceFile((sf) => {
    appendImports(sf, [
      {
        namedImports: ['MongoDatabaseConfigOptions', 'MongoDatabaseModule'],
        moduleSpecifier: `@${input.options.libsMonorepoNpmScope}/${input.options.nestUtilProjectName}`,
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
          .write(`dbName: '${kebabCase(input.options.projectName)}',`);
      });
  };

  sf.insertStatements(appModuleStatementIndex, [statement]);
}

// const TS_PARSER = require('recast/parsers/typescript');
//
// export function addMongoDatabaseToBackendRecast(
//   input: AddMongoDatabaseToBackendInput
// ): string {
//   const ast = recast.parse(input.appModuleFile, {
//     parser: TS_PARSER,
//   });
//
//   recast.visit(ast, {
//     // visitPrintable(path: NodePath<namedTypes.Printable>): any {
//     //   console.log('printable', path.value.type);
//     //   this.traverse(path);
//     // },
//     // visitNode(path: NodePath<namedTypes.NewExpression>): any {
//     //   console.log('node', path.value.type);
//     //   this.traverse(path);
//     // },
//     // visitDecorator(path: NodePath<namedTypes.Decorator>): any {
//     //   console.log('decorator', path);
//     //   this.traverse(path);
//     // },
//     // visitAssignmentExpression(
//     //   path: NodePath<namedTypes.AssignmentExpression>
//     // ): any {
//     //   console.log('assignmentExpression', path);
//     //   this.traverse(path);
//     // },
//     // visitArrayExpression(path: NodePath<namedTypes.ArrayExpression>): any {
//     //   console.log('arrayExpression', path);
//     //   this.traverse(path);
//     // },
//     // visitLiteral(path: NodePath<namedTypes.Literal>): any {
//     //   // console.log('literal', path);
//     //   this.traverse(path);
//     // },
//     visitClassDeclaration(path: NodePath<n.ClassDeclaration>): any {
//       const value = path.value;
//       const name = value.id.name;
//       if (name === 'AppModule') {
//         const decorators = value.decorators;
//         for (const decorator of decorators) {
//           console.log(decorator);
//         }
//         this.abort();
//       }
//       this.traverse(path);
//     },
//   });
//
//   return recast.print(ast).code;
// }
