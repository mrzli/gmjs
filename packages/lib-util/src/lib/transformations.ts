import { JsonValue } from 'type-fest';

export function textToJson<T extends JsonValue = JsonValue>(
  content: string
): T {
  return JSON.parse(content);
}

export function jsonToText<T extends JsonValue = JsonValue>(json: T): string {
  return JSON.stringify(json);
}

export function jsonToPretty<T = JsonValue>(json: T): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
