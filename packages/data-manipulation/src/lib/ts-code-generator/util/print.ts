import * as ts from 'typescript';
import { NewLineKind } from 'typescript';

const PRINTER = ts.createPrinter({
  newLine: NewLineKind.LineFeed,
  omitTrailingSemicolon: false,
  removeComments: false,
});

export function statementsToString(
  f: ts.NodeFactory,
  statements: readonly ts.Statement[]
): string {
  const eofToken = f.createToken(ts.SyntaxKind.EndOfFileToken);
  const sourceFile = f.createSourceFile(
    statements,
    eofToken,
    ts.NodeFlags.None
  );
  return PRINTER.printFile(sourceFile);
}
