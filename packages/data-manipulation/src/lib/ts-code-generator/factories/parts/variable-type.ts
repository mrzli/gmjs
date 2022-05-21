import * as ts from 'typescript';
import { CodeFactory } from '../code-factory';
import {
  NullTrueFalse,
  CodeNodeVariableTypeKeywordType,
  CodeNodeVariableType,
} from '../../types/variable-type';

export function createVariableType(
  cf: CodeFactory,
  node: CodeNodeVariableType
): ts.TypeNode {
  const { f, options } = cf;

  switch (node.type) {
    case 'keyword':
      return f.createKeywordTypeNode(
        variableKeywordTypeToTsSyntaxKind(node.keywordType)
      );
    case 'reference':
      return f.createTypeReferenceNode(node.referenceType, undefined);
    case 'literal-string':
      return f.createLiteralTypeNode(
        f.createStringLiteral(node.literal, options.singleQuotes)
      );
    case 'literal-number':
      return f.createLiteralTypeNode(f.createNumericLiteral(node.literal));
    case 'literal-null-true-false':
      return f.createLiteralTypeNode(toNullTrueFalseLiteral(f, node.literal));
    case 'literal-object':
      return f.createTypeLiteralNode(node.members.map((p) => cf.property(p)));
    case 'generic':
      return f.createTypeReferenceNode(
        node.referenceType,
        node.genericTypes.map((t) => createVariableType(cf, t))
      );
    case 'union':
      return f.createUnionTypeNode(
        node.unionTypes.map((t) => createVariableType(cf, t))
      );
    case 'array':
      return f.createTypeOperatorNode(
        ts.SyntaxKind.ReadonlyKeyword,
        f.createArrayTypeNode(createVariableType(cf, node.itemType))
      );
  }
}

function variableKeywordTypeToTsSyntaxKind(
  keywordType: CodeNodeVariableTypeKeywordType
): ts.KeywordTypeSyntaxKind {
  switch (keywordType) {
    case 'string':
      return ts.SyntaxKind.StringKeyword;
    case 'number':
      return ts.SyntaxKind.NumberKeyword;
    case 'boolean':
      return ts.SyntaxKind.BooleanKeyword;
    case 'undefined':
      return ts.SyntaxKind.UndefinedKeyword;
    case 'never':
      return ts.SyntaxKind.NeverKeyword;
    case 'any':
      return ts.SyntaxKind.AnyKeyword;
    case 'unknown':
      return ts.SyntaxKind.UnknownKeyword;
  }
}

function toNullTrueFalseLiteral(
  f: ts.NodeFactory,
  literal: NullTrueFalse
): ts.NullLiteral | ts.TrueLiteral | ts.FalseLiteral {
  switch (literal) {
    case null:
      return f.createNull();
    case true:
      return f.createTrue();
    case false:
      return f.createFalse();
  }
}
