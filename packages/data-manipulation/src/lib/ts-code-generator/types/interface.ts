import { CodeNodeProperty } from './property';
import { CodeNodeBase } from './code-node';

export interface CodeNodeInterface extends CodeNodeBase {
  readonly nodeType: 'interface';
  readonly name: string;
  readonly members: readonly CodeNodeProperty[];
}
