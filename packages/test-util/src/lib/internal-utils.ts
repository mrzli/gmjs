import { AnyValue } from '@gmjs/util';

export function toTestJsonFileContent(json: AnyValue): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
