import { SchemaToCliAppCodeInput } from './schema-to-cli-app-code-input';
import { generateAppCode } from './impl/generate-app-code';
import { PathContentPair } from '@gmjs/fs-util';

export function schemaToCliAppCode(
  input: SchemaToCliAppCodeInput
): readonly PathContentPair[] {
  return generateAppCode(input);
}
