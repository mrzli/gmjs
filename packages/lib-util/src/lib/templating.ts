import { AnyObject } from '@gmjs/util';
import ejs from 'ejs';

export function processTemplateContent(
  content: string,
  substitutions?: AnyObject
): string {
  return substitutions ? ejs.render(content, substitutions) : content;
}

export function substituteFilePath(
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
