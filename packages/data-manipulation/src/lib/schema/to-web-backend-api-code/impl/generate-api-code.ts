import { SchemaToWebBackendApiCodeInput } from '../schema-to-web-backend-api-code-input';
import { PathContentPair } from '@gmjs/fs-util';
import { generateEntityApiCode } from './generate-entity-api-code';

export function generateApiCode(
  input: SchemaToWebBackendApiCodeInput
): readonly PathContentPair[] {
  return input.schemas.map((schema) => generateEntityApiCode(input, schema));
}
