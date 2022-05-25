import { AnyValue } from '@gmjs/util';

export function textToJson<T extends AnyValue = AnyValue>(content: string): T {
  return JSON.parse(content);
}

export function jsonToText<T extends AnyValue = AnyValue>(json: T): string {
  return JSON.stringify(json);
}

export function jsonToPretty<T = AnyValue>(json: T): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
