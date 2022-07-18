import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateActions } from './test-assets/impl/generate-actions';

export function schemaToWebActionReducerCode(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  return [...generateActions(input)];
}
