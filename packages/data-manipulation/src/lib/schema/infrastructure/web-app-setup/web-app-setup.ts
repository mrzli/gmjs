import { WebAppSetupInput } from './web-app-setup-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateFiles } from '../../../shared/file-util';
import path from 'path';
import { toLibModuleNameSubstitutions } from '../../shared/util';

export function webAppSetup(
  input: WebAppSetupInput
): readonly PathContentPair[] {
  return generateFiles(path.join(__dirname, 'assets/files'), {
    ...toLibModuleNameSubstitutions(input.options.libModuleNames),
    template: '',
  });
}
