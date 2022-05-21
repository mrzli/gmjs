import * as path from 'path';
import { pathWithoutExtension } from '@gmjs/fs-util';

export function getRelativeImportPath(
  importingFilePath: string,
  filePathToImport: string
): string {
  const relativePath = pathWithoutExtension(
    path.relative(path.dirname(importingFilePath), filePathToImport)
  );
  return `./${relativePath}`;
}
