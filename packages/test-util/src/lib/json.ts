import * as util from 'util';

export function toTestJsonFileContent(json: any): string {
  return `${JSON.stringify(json, null, 2)}\n`;
}
