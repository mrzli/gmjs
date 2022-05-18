// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function textToJson(content: string): any {
  return JSON.parse(content);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToText(json: any): string {
  return JSON.stringify(json);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToPretty(json: any): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
