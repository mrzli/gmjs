import { pathExtension } from '../path';
import { FileSelectionPredicate } from './types';

export function createExtensionPredicate(
  extension: string
): FileSelectionPredicate {
  return (filePath: string) =>
    pathExtension(filePath).toLowerCase() === extension.toLowerCase();
}
