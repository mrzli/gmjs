import { CodeNodeProperty } from './property';
import { ArrayMinLength1 } from '@gmjs/util';
import { CodeNodeBase } from './code-node';

export type TypeOfCodeNodeVariableType =
  | 'keyword'
  | 'reference'
  | 'literal-string'
  | 'literal-number'
  | 'literal-null-true-false'
  | 'literal-object'
  | 'generic'
  | 'union'
  | 'array';

export interface CodeNodeVariableTypeBase extends CodeNodeBase {
  readonly nodeType: 'variable-type';
  readonly type: TypeOfCodeNodeVariableType;
}

const CODE_NODE_VARIABLE_TYPE_KEYWORD_TYPES = [
  'string',
  'number',
  'boolean',
  'undefined',
  'never',
  'any',
  'unknown',
] as const;

export type CodeNodeVariableTypeKeywordType =
  typeof CODE_NODE_VARIABLE_TYPE_KEYWORD_TYPES[number];

export interface CodeNodeVariableTypeKeyword extends CodeNodeVariableTypeBase {
  readonly type: 'keyword';
  readonly keywordType: CodeNodeVariableTypeKeywordType;
}

export interface CodeNodeVariableTypeReference
  extends CodeNodeVariableTypeBase {
  readonly type: 'reference';
  readonly referenceType: string;
}

export interface CodeNodeVariableTypeLiteralString
  extends CodeNodeVariableTypeBase {
  readonly type: 'literal-string';
  readonly literal: string;
}

export interface CodeNodeVariableTypeLiteralNumber
  extends CodeNodeVariableTypeBase {
  readonly type: 'literal-number';
  readonly literal: string;
}

export type NullTrueFalse = null | true | false;

export interface CodeNodeVariableTypeLiteralNullTrueFalse
  extends CodeNodeVariableTypeBase {
  readonly type: 'literal-null-true-false';
  readonly literal: NullTrueFalse;
}

export interface CodeNodeVariableTypeLiteralObject
  extends CodeNodeVariableTypeBase {
  readonly type: 'literal-object';
  readonly members: readonly CodeNodeProperty[];
}

export interface CodeNodeVariableTypeGeneric extends CodeNodeVariableTypeBase {
  readonly type: 'generic';
  readonly referenceType: string;
  readonly genericTypes: ArrayMinLength1<CodeNodeVariableType>;
}

export interface CodeNodeVariableTypeUnion extends CodeNodeVariableTypeBase {
  readonly type: 'union';
  readonly unionTypes: ArrayMinLength1<CodeNodeVariableType>;
}

export interface CodeNodeVariableTypeArray extends CodeNodeVariableTypeBase {
  readonly type: 'array';
  readonly itemType: CodeNodeVariableType;
}

export type CodeNodeVariableType =
  | CodeNodeVariableTypeKeyword
  | CodeNodeVariableTypeReference
  | CodeNodeVariableTypeLiteralString
  | CodeNodeVariableTypeLiteralNumber
  | CodeNodeVariableTypeLiteralNullTrueFalse
  | CodeNodeVariableTypeLiteralObject
  | CodeNodeVariableTypeGeneric
  | CodeNodeVariableTypeUnion
  | CodeNodeVariableTypeArray;
