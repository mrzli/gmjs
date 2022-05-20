import { JsonValue } from 'type-fest';
import { AnyValue } from '@gmjs/util';

export function textToJson(content: string): AnyValue {
  return JSON.parse(content);
}

export function jsonToText(json: JsonValue): string {
  return JSON.stringify(json);
}

export function jsonToPretty(json: JsonValue): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
