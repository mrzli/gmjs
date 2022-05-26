import path from 'path';

export function isInDir(rootDir: string, fsPath: string): boolean {
  const relative = path.relative(rootDir, fsPath);
  return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export function pathWithoutExtension(fullPath: string): string {
  const pathInfo = path.parse(fullPath);
  return path.join(pathInfo.dir, pathInfo.name);
}
