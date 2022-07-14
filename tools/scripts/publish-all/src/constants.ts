import { ProjectVersion } from './types';

export const ENCODING = 'utf-8';

export const PROJECT_VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)$/;

export const MINIMUM_VERSION: ProjectVersion = {
  major: 0,
  minor: 0,
  patch: 0,
};
