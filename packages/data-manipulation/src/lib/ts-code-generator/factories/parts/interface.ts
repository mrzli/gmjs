import * as ts from 'typescript';
import { createProperty } from './property';
import { CodeFactory } from '../code-factory';
import { CodeNodeInterface } from '../../types/interface';

export function createInterface(
  cf: CodeFactory,
  node: CodeNodeInterface
): ts.InterfaceDeclaration {
  const f = cf.f;

  return f.createInterfaceDeclaration(
    undefined,
    [f.createModifier(ts.SyntaxKind.ExportKeyword)],
    f.createIdentifier(node.name),
    undefined,
    undefined,
    node.members.map((p) => createProperty(cf, p))
  );
}
