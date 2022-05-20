import * as path from 'path';

export function isInDir(rootDir: string, fsPath: string): boolean {
  const relative = path.relative(rootDir, fsPath);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
