import { AnyValue } from '@gmjs/util';

export function textToJson<T extends AnyValue = AnyValue>(content: string): T {
  return JSON.parse(content);
}

export function jsonToText<T extends AnyValue = AnyValue>(json: T): string {
  return JSON.stringify(json);
}

export interface JsonToPrettyOptions {
  readonly newLineAtEnd?: boolean;
}

export function jsonToPretty<T = AnyValue>(
  json: T,
  options?: JsonToPrettyOptions
): string {
  const finalOptions = getFinalJsonToPrettyOptions(options);
  const newLineCharacter = finalOptions.newLineAtEnd ? '\n' : '';

  return `${JSON.stringify(json, null, 2)}${newLineCharacter}`;
}

function getFinalJsonToPrettyOptions(
  options?: JsonToPrettyOptions
): Required<JsonToPrettyOptions> {
  return {
    newLineAtEnd: options?.newLineAtEnd ?? true,
  };
}

export function stringArrayToLines(stringArray: readonly string[]): string {
  return stringArray.join('\n');
}
