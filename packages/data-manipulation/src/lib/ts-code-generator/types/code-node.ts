import { CodeNodeInterface } from './interface';
import { CodeNodeProperty } from './property';
import { CodeNodeVariableType } from './variable-type';

export type TypeOfCodeNode = 'interface' | 'property' | 'variable-type';

export interface CodeNodeBase {
  readonly nodeType: TypeOfCodeNode;
}

export type CodeNode =
  | CodeNodeInterface
  | CodeNodeProperty
  | CodeNodeVariableType;
