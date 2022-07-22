import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateActions } from './test-assets/impl/generate-actions';
import { generateReducers } from './test-assets/impl/generate-reducers';
import { generateAppAction } from './test-assets/impl/generate-app-action';

export function schemaToWebActionReducerCode(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  return [
    ...generateActions(input),
    generateAppAction(input),
    ...generateReducers(input),
  ];
}
