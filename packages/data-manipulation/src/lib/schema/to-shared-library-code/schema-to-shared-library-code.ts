import { SchemaToSharedLibraryCodeInput } from './schema-to-shared-library-code-input';
import { generateSharedLibCode } from './impl/generate-shared-lib-code';
import { CodeFileResult } from '../shared/code-util';

export function schemaToSharedLibraryCode(
  input: SchemaToSharedLibraryCodeInput
): readonly CodeFileResult[] {
  return generateSharedLibCode(input);
}
