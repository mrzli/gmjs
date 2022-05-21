import { CodeNodeVariableType } from './variable-type';
import { CodeNodeBase } from './code-node';

export interface CodeNodeProperty extends CodeNodeBase {
  readonly nodeType: 'property';
  readonly name: string;
  readonly variableType: CodeNodeVariableType;
  readonly isReadonly: boolean;
  readonly isOptional: boolean;
}
