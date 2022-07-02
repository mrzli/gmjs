import { SchemaToBackendAppCodeInput } from './schema-to-backend-app-code-input';
import { generateAppCode } from './impl/generate-app-code';
import { CodeFileResult } from '../shared/code-util';

export function schemaToBackendAppCode(
  input: SchemaToBackendAppCodeInput
): readonly CodeFileResult[] {
  return generateAppCode(input);
}
