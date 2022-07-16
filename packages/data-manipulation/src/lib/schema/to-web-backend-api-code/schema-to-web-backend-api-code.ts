import { SchemaToWebBackendApiCodeInput } from './schema-to-web-backend-api-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { createTsSourceFile } from '@gmjs/data-manipulation';
import { invariant } from '@gmjs/util';
import { SyntaxKind } from 'ts-morph';
import { generateApiCode } from './impl/generate-api-code';

export function schemaToWebBackendApiCode(
  input: SchemaToWebBackendApiCodeInput
): readonly PathContentPair[] {
  return generateApiCode(input);
  // const resultFile = createTsSourceFile((sf) => {
  //   const func = sf.getFunction('someInputFunction');
  //   invariant(!!func, 'Function must exist.');
  //   func.rename('someResultFunction');
  //
  //   const consoleLogCallExpression = func
  //     .getStatements()[0]
  //     .asKind(SyntaxKind.ExpressionStatement)
  //     ?.getExpression()
  //     ?.asKind(SyntaxKind.CallExpression);
  //   invariant(
  //     !!consoleLogCallExpression,
  //     'Failed to find console log call expression.'
  //   );
  //   consoleLogCallExpression.removeArgument(0);
  //   consoleLogCallExpression.addArgument("'some result text'");
  //
  //   sf.forEachDescendant((node, traversal) => {
  //     switch (node.getKind()) {
  //       case SyntaxKind.Identifier:
  //         if (node.getText() === 'inputValue') {
  //           node.asKind(SyntaxKind.Identifier)?.rename('resultValue');
  //           traversal.up();
  //         }
  //         break;
  //     }
  //   });
  // },);
}
