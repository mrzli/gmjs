import { CamelCase, KebabCase, PascalCase } from 'type-fest';
import {
  camelCase as _camelCase,
  paramCase as _paramCase,
  pascalCase as _pascalCase,
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
