import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateActions } from './impl/generate-actions';
import { generateReducers } from './impl/generate-reducers';
import { generateAppAction } from './impl/generate-app-action';
import { generateAppReducer } from './impl/generate-app-reducer';
import { generateStoreHooks } from './impl/generate-store-hooks';

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
