import fs from 'fs-extra';
import { ENCODING_UTF8 } from './constants';
import { AnyValue } from '@gmjs/util';
import { FileSelectionPredicate, PathContentPair } from './types';
import { findFilesShallowSync } from '../find';
import { createExtensionPredicate } from './util';

export function readTextSync(filePath: string): string {
  return fs.readFileSync(filePath, ENCODING_UTF8);
}

export function readTextsByExtensionSync(
  dirPath: string,
  extension: string
): readonly PathContentPair[] {
  return readTextsByPredicateSync(dirPath, createExtensionPredicate(extension));
}

export function readTextsByPredicateSync(
  dirPath: string,
  predicate: FileSelectionPredicate
): readonly PathContentPair[] {
  const results: PathContentPair[] = [];

  const files = findFilesShallowSync(dirPath);
  for (const file of files) {
    const filePath = file.fullPath;
    if (predicate(filePath)) {
      const content = readTextSync(filePath);
      results.push({ path: filePath, content });
    }
  }

  return results;
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

export function writeTextSync(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content, ENCODING_UTF8);
}

export async function writeTextAsync(
  filePath: string,
  content: string
): Promise<void> {
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}

export function existsSync(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export async function existsAsync(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, _reject) => {
    fs.access(filePath, (err) => {
      resolve(!err);
    });
  });
}

export function ensureFileSync(filePath: string): void {
  fs.ensureFileSync(filePath);
}

export async function ensureFileAsync(filePath: string): Promise<void> {
  await fs.ensureFile(filePath);
}
