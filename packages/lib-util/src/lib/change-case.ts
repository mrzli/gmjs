import { CamelCase, KebabCase, PascalCase } from 'type-fest';
import {
  camelCase as _camelCase,
  paramCase as _paramCase,
  pascalCase as _pascalCase,
  capitalCase as _capitalCase,
  constantCase as _constantCase,
} from 'change-case';

export function kebabCase<T extends string>(value: T): KebabCase<T> {
  return _paramCase(value) as KebabCase<T>;
}

// TODO GM: PascalCase<T> resolves to never if value is string
//  returning only string until this is resolved
export function pascalCase<T extends string>(
  value: T
): string /* PascalCase<T> */ {
  return _pascalCase(value) as PascalCase<T>;
}

// TODO GM: CamelCase<T> resolves to never if value is string
//  returning only string until this is resolved
export function camelCase<T extends string>(
  value: T
): string /* CamelCase<T> */ {
  return _camelCase(value) as CamelCase<T>;
}

export function capitalCase(value: string): string {
  return _capitalCase(value);
}

export function constantCase(value: string): string {
  return _constantCase(value);
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
