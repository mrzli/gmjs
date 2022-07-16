import { SchemaToWebBackendApiCodeInput } from './schema-to-web-backend-api-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateApiCode } from './impl/generate-api-code';

export function schemaToWebBackendApiCode(
  input: SchemaToWebBackendApiCodeInput
): readonly PathContentPair[] {
  return generateApiCode(input);
}
