import { ProjectVersion } from './types';
import { MINIMUM_VERSION, PROJECT_VERSION_REGEX } from './constants';
import { PackageJson } from 'nx/src/utils/package-json';
import { invariant } from './util';

export function getMaxProjectVersion(
  packageJsons: readonly PackageJson[]
): ProjectVersion {
  const projectVersions = packageJsons.map(getPackageJsonVersion);
  return projectVersions.reduce(
    (max, curr) => (isVersionGreater(curr, max) ? curr : max),
    MINIMUM_VERSION
  );
}

function getPackageJsonVersion(packageJson: PackageJson): ProjectVersion {
  const versionString = packageJson.version;
  const versionMatch = versionString.match(PROJECT_VERSION_REGEX);
  invariant(!!versionMatch, `Invalid package json: '${versionString}'`);

  return {
    major: Number.parseInt(versionMatch[1]),
    minor: Number.parseInt(versionMatch[2]),
    patch: Number.parseInt(versionMatch[3]),
  };
}

function isVersionGreater(
  version: ProjectVersion,
  compareAgainst: ProjectVersion
): boolean {
  return compareProjectVersions(version, compareAgainst) > 0;
}

function compareProjectVersions(
  v1: ProjectVersion,
  v2: ProjectVersion
): number {
  const compareMajor = compareNumbers(v1.major, v2.major);
  if (compareMajor !== 0) {
    return compareMajor;
  }
  const compareMinor = compareNumbers(v1.minor, v2.minor);
  if (compareMinor !== 0) {
    return compareMinor;
  }
  return compareNumbers(v1.patch, v2.patch);
}

function compareNumbers(n1: number, n2: number): number {
  return Math.sign(n1 - n2);
}

export function projectVersionToString(version: ProjectVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}
