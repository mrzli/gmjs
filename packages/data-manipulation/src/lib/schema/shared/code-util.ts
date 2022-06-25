import prettier from 'prettier';
import { ImmutableMap } from '@gmjs/util';

export function processSourceFile(
  sourceFileText: string,
  placeholderMap: ImmutableMap<string, string>
): string {
  let replacedText = sourceFileText;
  for (const { key, value } of placeholderMap.entryPairs()) {
    replacedText = replacedText.replace(key, value);
  }

  return prettier.format(replacedText, {
    singleQuote: true,
    parser: 'typescript',
  });
}
