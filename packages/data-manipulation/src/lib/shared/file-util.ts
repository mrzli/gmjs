import { AnyObject } from '@gmjs/util';
import ejs from 'ejs';

export function processTemplateFile(
  content: string,
  substitutions?: AnyObject
): string {
  return substitutions ? ejs.render(content, substitutions) : content;
}
