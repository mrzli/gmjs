import fs from 'fs-extra';
import { promisify } from 'util';
import { ENCODING_UTF8 } from './util/constants';
import { AnyValue } from '@gmjs/util';

export function readTextSync(filePath: string): string {
  return fs.readFileSync(filePath, ENCODING_UTF8);
}

export async function readTextAsync(filePath: string): Promise<string> {
  return fs.readFile(filePath, ENCODING_UTF8);
}

export function readJsonSync<T = AnyValue>(filePath: string): T {
  return fs.readJsonSync(filePath, ENCODING_UTF8);
}

export async function readJsonAsync<T = AnyValue>(
  filePath: string
): Promise<T> {
  return fs.readJson(filePath, ENCODING_UTF8);
}

export function existsSync(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export async function existsAsync(filePath: string): Promise<boolean> {
  return promisify(fs.exists)(filePath);
}

export function ensureFileSync(filePath: string): void {
  fs.ensureFileSync(filePath);
}

export async function ensureFileAsync(filePath: string): Promise<void> {
  await fs.ensureFile(filePath);
}
