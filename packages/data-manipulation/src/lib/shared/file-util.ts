import { AnyObject } from '@gmjs/util';
import ejs from 'ejs';
import {
  findFilesDeepSync,
  PathContentPair,
  readTextSync,
} from '@gmjs/fs-util';
import path from 'path';

export function processTemplateFile(
  content: string,
  substitutions?: AnyObject
): string {
  return substitutions ? ejs.render(content, substitutions) : content;
}

export function generateFiles(
  filesDir: string,
  substitutions?: AnyObject
): readonly PathContentPair[] {
  const relativeFilePaths = getRelativeFilePaths(filesDir);
  return relativeFilePaths.map((p) => ({
    path: p,
    content: processTemplateFile(
      readTextSync(path.join(filesDir, p)),
      substitutions
    ),
  }));
}

function getRelativeFilePaths(dir: string): readonly string[] {
  const results = findFilesDeepSync(dir);
  return results.map((r) => path.relative(dir, r.fullPath));
}
