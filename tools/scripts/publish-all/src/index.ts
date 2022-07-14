import { logger } from '@nrwl/devkit';
import { bumpProjectVersion } from './project-version';
import { publishAllProjects } from './publish';
import { createWorkspaceTree } from './util';

async function publishAll(): Promise<void> {
  const tree = createWorkspaceTree();
  await bumpProjectVersion(tree);
  publishAllProjects(tree);
}

publishAll().finally(() => {
  logger.info('Publishing finished!');
});
