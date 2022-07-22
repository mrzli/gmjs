import { AnyObject } from '@gmjs/util';
import ejs from 'ejs';
import {
  findFilesDeepSync,
  PathContentPair,
  readTextSync,
} from '@gmjs/fs-util';
import path from 'path';

export function processTemplateContent(
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
    path: substituteFilePath(p, substitutions),
    content: processTemplateContent(
      readTextSync(path.join(filesDir, p)),
      substitutions
    ),
  }));
}

function getRelativeFilePaths(dir: string): readonly string[] {
  const results = findFilesDeepSync(dir);
  return results.map((r) => path.relative(dir, r.fullPath));
}

function substituteFilePath(
  filePath: string,
  substitutions?: AnyObject
): string {
  if (!substitutions) {
    return filePath;
  }

  let resultPath = filePath;
  Object.entries(substitutions).forEach(([propertyName, value]) => {
    resultPath = resultPath.split(`__${propertyName}__`).join(value);
  });
  return resultPath;
}
