import { SchemaToBackendAppCodeInput } from './schema-to-backend-app-code-input';
import { generateAppCode } from './impl/generate-app-code';
import { PathContentPair } from '@gmjs/fs-util';

export function schemaToBackendAppCode(
  input: SchemaToBackendAppCodeInput
): readonly PathContentPair[] {
  return generateAppCode(input);
}
