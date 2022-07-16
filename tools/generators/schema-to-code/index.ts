import {
  Tree,
  formatFiles,
  names,
  offsetFromRoot,
  generateFiles,
} from '@nrwl/devkit';
import { SchemaToCodeSchema } from './schema';
import path from 'path';

export async function generateSchemaToCode(
  tree: Tree,
  options: SchemaToCodeSchema
): Promise<void> {
  addFiles(tree, options);
  await formatFiles(tree);
}

function addFiles(tree: Tree, options: SchemaToCodeSchema): void {
  const dir = 'packages/data-manipulation/src/lib/schema';

  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(dir),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), dir, templateOptions);
}

export default generateSchemaToCode;
