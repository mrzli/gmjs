import * as fs from 'fs-extra';
import * as klawSync from 'klaw-sync';
import { ENCODING_UTF8 } from '../constants';

export function readTextSync(filePath: string): string {
  return fs.readFileSync(filePath, ENCODING_UTF8);
}

export async function readTextAsync(filePath: string): Promise<string> {
  return fs.readFile(filePath, ENCODING_UTF8);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readJsonSync(filePath: string): any {
  return fs.readJsonSync(filePath, ENCODING_UTF8);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function readJsonAsync(filePath: string): Promise<any> {
  return fs.readJson(filePath, ENCODING_UTF8);
}
