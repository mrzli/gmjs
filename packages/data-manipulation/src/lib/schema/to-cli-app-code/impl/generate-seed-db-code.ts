import { SchemaToCliAppCodeInput } from '../schema-to-cli-app-code-input';
import { createTsSourceFile } from '../../../shared/code-util';

export function generateSeedDbCode(input: SchemaToCliAppCodeInput): string {
  return createTsSourceFile((sf) => {});
}
