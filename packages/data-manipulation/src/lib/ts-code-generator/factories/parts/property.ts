import ts from 'typescript';
import { createVariableType } from './variable-type';
import { CodeFactory } from '../code-factory';
import { CodeNodeProperty } from '../../types/property';

export function createProperty(
  cf: CodeFactory,
  node: CodeNodeProperty
): ts.PropertySignature {
  const f = cf.f;

  return f.createPropertySignature(
    node.isReadonly ? [f.createModifier(ts.SyntaxKind.ReadonlyKeyword)] : [],
    f.createIdentifier(node.name),
    node.isOptional ? f.createToken(ts.SyntaxKind.QuestionToken) : undefined,
    createVariableType(cf, node.variableType)
  );
}
