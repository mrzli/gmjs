import {
  Tree,
  formatFiles,
  names,
  offsetFromRoot,
  generateFiles,
} from '@nrwl/devkit';
import { CodeInfrastructureSchema } from './schema';
import * as path from 'path';

export async function generateCodeInfrastructure(
  tree: Tree,
  options: CodeInfrastructureSchema
): Promise<void> {
  addFiles(tree, options);
  await formatFiles(tree);
}

function addFiles(tree: Tree, options: CodeInfrastructureSchema): void {
  const dir = 'packages/data-manipulation/src/lib/schema/infrastructure';

  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(dir),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), dir, templateOptions);
}

export default generateCodeInfrastructure;
