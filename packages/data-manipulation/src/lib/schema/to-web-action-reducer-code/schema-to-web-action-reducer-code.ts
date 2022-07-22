import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateActions } from './test-assets/impl/generate-actions';
import { generateReducers } from './test-assets/impl/generate-reducers';
import { generateAppAction } from './test-assets/impl/generate-app-action';
import { generateAppReducer } from './test-assets/impl/generate-app-reducer';
import { generateStoreHooks } from './test-assets/impl/generate-store-hooks';

export function schemaToWebActionReducerCode(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  return [
    ...generateActions(input),
    generateAppAction(input),
    ...generateReducers(input),
    generateAppReducer(input),
    generateStoreHooks(input),
  ];
}
