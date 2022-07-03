import { SchemaToCliAppCodeInput } from '../schema-to-cli-app-code-input';
import { createTsSourceFile } from '../../../shared/source-file-util';

export function generateSeedDbCode(input: SchemaToCliAppCodeInput): string {
  return createTsSourceFile((sf) => {});
}
