import path from 'path';
import { PathContentPair } from '@gmjs/fs-util';
import { SchemaToWebActionReducerCodeInput } from './schema-to-web-action-reducer-code-input';
import { generateActions } from './impl/generate-actions';
import { generateReducers } from './impl/generate-reducers';
import { generateAppAction } from './impl/generate-app-action';
import { generateAppReducer } from './impl/generate-app-reducer';
import { generateStoreHooks } from './impl/generate-store-hooks';
import { generateFiles } from '../../shared/file-util';
import { toLibModuleNameSubstitutions } from '../shared/util';

export function schemaToWebActionReducerCode(
  input: SchemaToWebActionReducerCodeInput
): readonly PathContentPair[] {
  const generatedFiles = generateFiles(path.join(__dirname, 'assets/files'), {
    ...toLibModuleNameSubstitutions(input.options.libModuleNames),
    template: '',
  });

  return [
    ...generatedFiles,
    ...generateActions(input),
    generateAppAction(input),
    ...generateReducers(input),
    generateAppReducer(input),
    generateStoreHooks(input),
  ];
}
