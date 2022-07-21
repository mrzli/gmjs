import {
  camelCase as _camelCase,
  paramCase as _paramCase,
  pascalCase as _pascalCase,
  capitalCase as _capitalCase,
  constantCase as _constantCase,
} from 'change-case';

export function pascalCase(value: string): string {
  return _pascalCase(value);
}

export function camelCase(value: string): string {
  return _camelCase(value);
}

export function kebabCase(value: string): string {
  return _paramCase(value);
}

export function constantCase(value: string): string {
  return _constantCase(value);
}

export function capitalCase(value: string): string {
  return _capitalCase(value);
}

export function pascalCaseJoined(...values: readonly string[]): string {
  const joinedValues = values.join(' ');
  return _pascalCase(joinedValues);
}

export function camelCaseJoined(...values: readonly string[]): string {
  const joinedValues = values.join(' ');
  return _camelCase(joinedValues);
}

export function kebabCaseJoined(...values: readonly string[]): string {
  const joinedValues = values.join(' ');
  return _paramCase(joinedValues);
}

export function constantCaseJoined(...values: readonly string[]): string {
  const joinedValues = values.join(' ');
  return _constantCase(joinedValues);
}

export function capitalCaseJoined(...values: readonly string[]): string {
  const joinedValues = values.join(' ');
  return _capitalCase(joinedValues);
}

export interface CasedNames {
  readonly pascalCased: string;
  readonly camelCased: string;
  readonly kebabCased: string;
  readonly constantCased: string;
}

export function casedNames(...values: readonly string[]): CasedNames {
  const joinedValues = values.join(' ');
  return {
    pascalCased: pascalCase(joinedValues),
    camelCased: camelCase(joinedValues),
    kebabCased: kebabCase(joinedValues),
    constantCased: constantCase(joinedValues),
  };
}
