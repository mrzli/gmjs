import { identifyFn, ReadonlyRecord } from '@gmjs/util';
import { findFilesShallowSync } from './find';
import path from 'path';
import { readTextSync } from './file-system/file-system';

export interface DirFilesReadResult<T> {
  readonly dirFullPath: string;
  readonly files: ReadonlyRecord<string, T>;
}

export type FileContentTransformerFn<T> = (
  content: string,
  fileName: string
) => T;

export function readTextFilesInDirSync(
  dir: string
): DirFilesReadResult<string> {
  return readFilesInDirSync(dir, identifyFn);
}

export function readFilesInDirSync<T>(
  dir: string,
  contentTransformer: FileContentTransformerFn<T>
): DirFilesReadResult<T> {
  return {
    dirFullPath: dir,
    files: readFilesInDirSyncInternal(dir, contentTransformer),
  };
}

function readFilesInDirSyncInternal<T>(
  dir: string,
  contentTransformer: FileContentTransformerFn<T>
): ReadonlyRecord<string, T> {
  const files = findFilesShallowSync(dir);
  return files.reduce<ReadonlyRecord<string, T>>((acc, f) => {
    const fileName = path.basename(f.fullPath);
    const content = readTextSync(f.fullPath);
    return { ...acc, [fileName]: contentTransformer(content, fileName) };
  }, {});
}
