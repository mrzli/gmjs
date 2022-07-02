import { SchemaToSharedLibraryCodeInput } from './schema-to-shared-library-code-input';
import { generateSharedLibCode } from './impl/generate-shared-lib-code';
import { PathContentPair } from '@gmjs/fs-util';

export function schemaToSharedLibraryCode(
  input: SchemaToSharedLibraryCodeInput
): readonly PathContentPair[] {
  return generateSharedLibCode(input);
}
